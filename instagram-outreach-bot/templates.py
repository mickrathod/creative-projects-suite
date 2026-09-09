import re
import random

def resolve_spintax(text: str) -> str:
    """
    Recursively resolves spintax like {Hi|Hello|Hey} into a randomly chosen variation.
    Supports nested spintax.
    """
    pattern = re.compile(r"\{([^{}]+)\}")
    while pattern.search(text):
        text = pattern.sub(lambda m: random.choice(m.group(1).split("|")), text)
    return text

TEMPLATES = {
    # 1. Chartered Accountants & Tax Consultants
    "CA": [
        (
            "{Hi|Hello|Hey} {name}! 👋\n\n"
            "{Came across|Noticed|Found} your profile while looking up leading CA & tax professionals. "
            "{Quick question|Had a quick thought}: during peak tax & audit seasons, does your team spend a ton of time {manually chasing clients for documents & pending GST invoices|following up on missing tax documents}? \n\n"
            "I build custom, secure {client document collection portals & automated status dashboards|tax workflow software} for CAs. "
            "It {automatically reminds clients on WhatsApp/Email|streamlines document collection} so your staff saves 10+ hours every week.\n\n"
            "Would you be open to a 2-min demo or a quick screenshot of how it works? No pressure at all! 😊"
        ),
        (
            "{Hello|Hi|Greetings} {name}, {hope you're having a productive week|hope all is well with you}.\n\n"
            "I specialize in building custom automation tools for {CA firms and accounting practices|financial consultancies}.\n\n"
            "We recently developed a {private client portal where clients upload their IT/GST docs with automated checklists|smart document collection system that eliminates email back-and-forth}.\n\n"
            "If this sounds relevant to {your firm|your practice}, I'd love to share a quick 60-second video demo. Would that be fine to send over? 🚀"
        )
    ],

    # 2. General Company / Business Owner
    "Company": [
        (
            "{Hi|Hey|Hello} {name}! {Hope your week is going great|Hope you're doing well}.\n\n"
            "{I came across|I noticed|Checked out} {business_name} and really liked what you guys are building. 👏\n\n"
            "I'm a software developer helping businesses build custom tools that {automate operations and bring in higher conversion leads|replace tedious manual spreadsheets with clean web dashboards}.\n\n"
            "Things like: \n"
            "• Instant Quote & Price Calculators for your website (boosts lead capture 3x)\n"
            "• Custom Client Portals & Internal CRMs\n"
            "• Workflow & Billing Automation\n\n"
            "{Do you currently have any software or automation project in mind|Are you looking to upgrade any of your digital tools this quarter}? Would love to share some relevant examples if you're open to it!"
        ),
        (
            "{Hey|Hi|Hello} {name}, {quick question for you|hope all is well}.\n\n"
            "Are you guys at {business_name} currently using off-the-shelf SaaS that feels either {too expensive or doesn't quite fit your exact workflow|clunky and bloated}?\n\n"
            "I build {tailor-made, lightweight web software and customer portals|custom internal tools and client dashboards} built specifically around your exact business process—without the recurring per-seat monthly fees.\n\n"
            "Open to taking a quick look at some recent projects we've shipped? 🚀"
        )
    ],

    # 3. Local Services / Booking / Clinics / Salons
    "LocalService": [
        (
            "{Hi|Hey|Hello} {name}! 👋\n\n"
            "{Loved checking out|Really impressed by} {business_name}!\n\n"
            "I build custom {online booking systems & interactive quote calculators|customer self-service portals} for local businesses that allow customers to get instant pricing and book directly from Instagram / Google without waiting for a manual reply.\n\n"
            "It turns casual profile visitors into paying clients instantly. Would you be open to seeing a quick live preview of how it would look for {business_name}? 😊"
        )
    ],

    # 4. E-Commerce / D2C Brands
    "Ecommerce": [
        (
            "{Hey|Hi|Hello} {name}! {Huge fan of|Really love} the brand at {business_name}. 🔥\n\n"
            "I help eCommerce brands build custom software solutions like {automated WhatsApp order tracking & review collection bots|custom bundle builders and inventory sync tools}.\n\n"
            "If you're looking to boost repeat purchases or streamline backend operations this month, I'd love to share a couple of quick case studies. Mind if I drop a link? 📦"
        )
    ],

    # 5. Default General Template
    "General": [
        (
            "{Hi|Hey|Hello} {name}! 👋\n\n"
            "{Came across your page|Discovered your profile} and wanted to reach out. "
            "I'm a full-stack software developer specializing in building {custom web apps, client portals, and automation tools|tailor-made business software} designed to save time and automate manual work.\n\n"
            "Whether it's an internal workflow tool, a customer-facing portal, or an interactive tool to capture more leads—I can turn it into reality fast.\n\n"
            "Are you exploring any software or web development needs at the moment? Happy to bounce around some free ideas!"
        )
    ],

    # 6. Businesses / Companies with NO Website
    "NoWebsite": [
        (
            "{Hi|Hey|Hello} {name}! 👋\n\n"
            "{I came across your Instagram page|Really loved checking out your posts on {business_name}}! 👏\n\n"
            "I noticed that you {don't have an official website linked yet|are currently relying primarily on Instagram DMs without a dedicated website}.\n\n"
            "Having a fast, mobile-friendly website can help {business_name} {rank on Google searches, establish solid trust, and automatically collect client inquiries 24/7|turn daily profile visitors into paying customers on autopilot}.\n\n"
            "I build high-converting websites and web apps for growing businesses. "
            "I actually sketched out a quick concept mock-up for {business_name}—would you like me to send over a screenshot or preview link? No cost or obligation at all! 😊"
        ),
        (
            "{Hey|Hi|Hello} {name}! {Hope your week is going great|Hope all is well}.\n\n"
            "Was just checking out {business_name} here on Instagram. You guys have great content, but I noticed you don't have a website set up yet!\n\n"
            "Right now, many potential customers looking for your services on Google or wanting instant pricing/details might be dropping off without a site.\n\n"
            "I help businesses launch {sleek, high-converting modern websites with built-in WhatsApp lead capture & instant booking|custom websites that look stunning on phones and drive real sales}.\n\n"
            "Would you be open to taking a look at a quick free design preview for {business_name}? 🚀"
        )
    ],

    # 7. Chartered Accountants / Tax Consultants with NO Website
    "CANoWebsite": [
        (
            "{Hello|Hi} {name}! 👋\n\n"
            "{Came across your firm's profile|Noticed your practice on Instagram} while looking up tax & accounting professionals.\n\n"
            "I noticed your firm {doesn't have an official website or web portal linked yet|doesn't currently have a dedicated website for clients}.\n\n"
            "For a CA firm, having a professional website with an integrated client query form, GST/ITR service checklists, and a clean modern look establishes massive credibility and helps you win higher-paying corporate clients searching on Google.\n\n"
            "I build modern, fast websites and client portals specifically tailored for CAs.\n\n"
            "Would you be open to a quick 2-minute look at a sample website layout built for accounting practices? No pressure at all! 🚀"
        )
    ]
}

def get_outreach_message(category: str, name: str, business_name: str, has_website: bool = True) -> str:
    """
    Selects a template matching the category, fills parameters, and resolves spintax.
    Automatically selects high-converting 'No Website' templates if has_website is False.
    """
    clean_name = name.strip() if name and name.strip() else "there"
    clean_biz = business_name.strip() if business_name and business_name.strip() else "your business"
    
    cat_key = category.strip() if category and category.strip() in TEMPLATES else "General"

    # If the company doesn't have a website or category indicates no website:
    if not has_website or cat_key.lower() in ("nowebsite", "no_website", "no website"):
        if cat_key == "CA" or "ca" in clean_biz.lower():
            cat_key = "CANoWebsite"
        else:
            cat_key = "NoWebsite"

    templates_list = TEMPLATES.get(cat_key, TEMPLATES["General"])
    
    raw_template = random.choice(templates_list)
    formatted = raw_template.replace("{name}", clean_name).replace("{business_name}", clean_biz)
    resolved = resolve_spintax(formatted)
    return resolved
