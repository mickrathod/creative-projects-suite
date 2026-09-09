import re
import random

def resolve_spintax(text: str) -> str:
    """Recursively resolves spintax like {Respected|Hello|Hi} into a randomly chosen variation."""
    pattern = re.compile(r"\{([^{}]+)\}")
    while pattern.search(text):
        text = pattern.sub(lambda m: random.choice(m.group(1).split("|")), text)
    return text

CA_TEMPLATES = {
    # 1. Client Document Collection Portal (The #1 pain point for CAs)
    "PORTAL": [
        (
            "{Respected|Hello|Dear} CA {name} Ji, {hope you are doing well|greetings of the day}.\n\n"
            "{During tax and audit season, does your team spend countless hours chasing clients on WhatsApp and email for missing bank statements and GST documents?|Quick question: Is collecting pending documents from clients before GST/ITR filing deadlines a constant follow-up headache for your office?}\n\n"
            "I am a software developer specializing in building {custom client document collection portals for CA firms|custom digital workflow software for Chartered Accountants}.\n\n"
            "Here is how it helps your practice:\n"
            "✅ {Clients get a private, secure link to upload documents with an auto-checklist|Automated checklist where clients see exactly what pending docs to upload}\n"
            "✅ {Automated WhatsApp & Email reminders sent to clients for missing documents|Automatic reminders sent so your team doesn't have to follow up manually}\n"
            "✅ {Saves 10-15 staff hours every week during peak filing dates|Zero messy WhatsApp downloads or misplaced files}\n\n"
            "{Would you be open to a 60-second video demo or quick screenshot of the portal?|If interested, I'd be happy to share a 1-minute demo video. Would that be fine?} 😊"
        ),
        (
            "{Hello|Namaste|Greetings} CA {name} Ji, {hope all is well with you|hope your week is going great}.\n\n"
            "We recently developed a {custom client management & document collection tool specifically for CA practices|secure document portal for accounting firms}.\n\n"
            "Instead of clients sending scattered photos and PDFs across WhatsApp, they get a {dedicated portal with their pending document list and filing status|simple mobile-friendly link to submit all audit docs organized in one place}.\n\n"
            "It eliminates email back-and-forth and keeps all client tax records organized securely.\n\n"
            "{Would you like to take a look at a quick 1-minute demo? No obligation at all.|Can I send over a quick screenshot and demo link if you have 2 minutes?} 🚀"
        )
    ],

    # 2. Tax & GST Filing Status Dashboard + Client Tracker
    "FILING_TRACKER": [
        (
            "{Respected|Hello|Dear} CA {name} Ji, {greetings|hope you're having a productive day}.\n\n"
            "Clients frequently call CA offices asking: *'Sir, is my ITR filed?'* or *'Can you send my GST acknowledgement receipt again?'*\n\n"
            "We build {custom client self-service status portals for CA firms|automated filing tracker dashboards for CAs} where:\n"
            "• Clients can check their filing status live\n"
            "• Download their acknowledgements & computations anytime\n"
            "• Receive automated WhatsApp notifications the moment filing is completed\n\n"
            "It cuts client inquiry phone calls by over 70% and gives your firm an ultra-premium, modern image.\n\n"
            "Would you like to see a quick live sample? 📊"
        )
    ],

    # 3. Professional CA Firm Website + Digital Office
    "WEBSITE": [
        (
            "{Respected|Hello|Dear} CA {name} Ji, {hope you are doing well|warm greetings}.\n\n"
            "{I noticed that your firm doesn't have a modern official website linked yet|In today's digital era, having a professional firm website is essential for establishing strong authority and winning corporate advisory clients}.\n\n"
            "I build {modern, high-speed websites and digital offices specifically for Chartered Accountants & Tax Consultants|professional CA websites with built-in client inquiry forms and service portfolios}.\n\n"
            "Features include:\n"
            "• Professional presentation of your core practice areas (Audit, GST, Corporate Tax, RERA)\n"
            "• Client consultation booking & query form\n"
            "• 100% mobile-friendly design that ranks on Google\n\n"
            "{I actually have a ready layout designed for CA firms—would you be open to seeing a quick preview?|Would you like to see a sample live preview tailored for accounting practices?} 🚀"
        )
    ],

    # 4. General Custom Software Solution for CAs
    "GENERAL_CUSTOM": [
        (
            "{Respected|Hello|Dear} CA {name} Ji, {greetings of the day|hope all is well}.\n\n"
            "I build {custom software solutions and internal automation tools|tailor-made web applications} for Chartered Accountants to streamline daily office operations.\n\n"
            "Whether it is an internal task assignment dashboard for your articles/staff, an automated client billing & fee collection tracker, or a secure client portal—we build solutions tailored exactly to your practice's workflow.\n\n"
            "Are you currently looking to automate or upgrade any digital systems in your firm? Happy to discuss some ideas! 😊"
        )
    ]
}

def get_ca_message(pitch_type: str, ca_name: str, firm_name: str, city: str = "") -> str:
    """Selects a pitch template, fills placeholders, and resolves Spintax."""
    clean_name = ca_name.strip() if ca_name and ca_name.strip() else "Sir/Madam"
    clean_firm = firm_name.strip() if firm_name and firm_name.strip() else "your firm"
    
    # Normalize pitch type
    key = pitch_type.strip().upper() if pitch_type else "PORTAL"
    if key not in CA_TEMPLATES:
        if "WEB" in key:
            key = "WEBSITE"
        elif "TRACK" in key or "STATUS" in key:
            key = "FILING_TRACKER"
        elif "CUSTOM" in key or "GENERAL" in key:
            key = "GENERAL_CUSTOM"
        else:
            key = "PORTAL"

    templates_list = CA_TEMPLATES[key]
    raw_template = random.choice(templates_list)
    
    formatted = (
        raw_template
        .replace("{name}", clean_name)
        .replace("{firm_name}", clean_firm)
        .replace("{city}", city.strip() if city else "")
    )
    resolved = resolve_spintax(formatted)
    return resolved
