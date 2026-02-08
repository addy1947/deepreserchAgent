
import { NextResponse } from "next/server";
import dns from "node:dns/promises";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const domain = searchParams.get("domain");

    if (!domain) {
        return NextResponse.json({ error: "Missing domain parameter" }, { status: 400 });
    }

    const cleanDomain = domain.replace(/^https?:\/\//, "").replace(/\/$/, "");

    try {
        console.log(`Analyzing Domain: ${cleanDomain}`);

        let registrationData: any = { status: "unknown" };
        try {
            const rdapRes = await fetch(`https://rdap.org/domain/${cleanDomain}`, {
                headers: { "Accept": "application/rdap+json" }
            });
            if (rdapRes.ok) {
                const rdapJson = await rdapRes.json();

                const events = rdapJson.events || [];
                const created = events.find((e: any) => e.eventAction === "registration")?.eventDate;
                const updated = events.find((e: any) => e.eventAction === "last changed")?.eventDate;
                const expiration = events.find((e: any) => e.eventAction === "expiration")?.eventDate;

                const entities = rdapJson.entities || [];
                const registrar = entities.find((e: any) => e.roles?.includes("registrar"))?.vcardArray?.[1]?.find((i: any) => i[0] === "fn")?.[3];

                registrationData = {
                    registrar: registrar || "Unknown",
                    createdDate: created || "Unknown",
                    updatedDate: updated || "Unknown",
                    expirationDate: expiration || "Unknown",
                    status: rdapJson.status?.[0] || "Unknown"
                };
            } else {
                registrationData.error = "RDAP lookup failed (Domain might be private/reserved)";
            }
        } catch (e) {
            console.warn("RDAP fetch failed", e);
            registrationData.error = "RDAP fetch error";
        }

        const dnsRecords: any = {};

        try {
            const aRecords = await dns.resolve4(cleanDomain);
            dnsRecords.a = aRecords;
        } catch (e) {
            dnsRecords.a = [];
        }

        try {
            const mxRecords = await dns.resolveMx(cleanDomain);
            dnsRecords.mx = mxRecords.map(r => r.exchange);
        } catch (e) {
            dnsRecords.mx = [];
        }

        try {
            const nsRecords = await dns.resolveNs(cleanDomain);
            dnsRecords.ns = nsRecords;
        } catch (e) {
            dnsRecords.ns = [];
        }

        try {
            const txtRecords = await dns.resolveTxt(cleanDomain);
            dnsRecords.txt = txtRecords.flat();
        } catch (e) {
            dnsRecords.txt = [];
        }

        return NextResponse.json({
            domain: cleanDomain,
            whois: registrationData,
            dns: dnsRecords
        });

    } catch (error: any) {
        console.error("Error analyzing domain:", error);
        return NextResponse.json(
            { error: `Failed to analyze domain: ${error.message}` },
            { status: 500 }
        );
    }
}
