"""
Email templates tailored for different job/contract categories:
- shopify: Focuses on Shopify Custom Apps, Liquid themes, and Storefront APIs
- laravel_react: Focuses on Laravel backends, APIs, and React frontend architecture
- wordpress: Focuses on custom WordPress plugins, Gutenberg blocks, and WooCommerce
- fullstack: Comprehensive showcase across React, Laravel, Shopify, and WordPress
"""

def get_email_content(category, recipient_name, recipient_company, user_info):
    name = recipient_name if recipient_name and recipient_name.strip() else "there"
    company = recipient_company if recipient_company and recipient_company.strip() else "your team"
    
    my_name = user_info.get("name", "Full-Stack Developer")
    my_portfolio = user_info.get("portfolio", "#")
    my_linkedin = user_info.get("linkedin", "#")
    my_phone = user_info.get("phone", "")

    # Base styles for clean, modern email presentation
    styles = """
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
        color: #24292f;
        line-height: 1.6;
        font-size: 15px;
    """

    cat = (category or "fullstack").lower().strip()

    if cat == "shopify":
        subject = f"Shopify App & Theme Developer for {company}"
        body_html = f"""
        <div style="{styles}">
            <p>Hi {name},</p>
            <p>I hope you're having a productive week! I came across <strong>{company}</strong> and wanted to reach out regarding remote development support.</p>
            <p>I am a remote developer specializing in <strong>Shopify development and customization</strong>:</p>
            <ul style="padding-left: 20px; line-height: 1.8;">
                <li><strong>Custom Shopify Apps:</strong> Building embedded apps using Remix/React, Node/Laravel backends, and GraphQL Admin APIs.</li>
                <li><strong>Theme Customization:</strong> Developing custom Liquid sections, theme app extensions, and pixel-perfect Figma-to-Shopify conversions.</li>
                <li><strong>Headless & APIs:</strong> Storefront API integrations, custom checkout UI extensions, and speed optimization.</li>
            </ul>
            <p>Whether you need dedicated development capacity for upcoming client launches or custom Shopify features, I can hit the ground running with clean code and quick turnaround.</p>
            <p><strong>Portfolio & Work:</strong> <a href="{my_portfolio}" style="color: #0969da; text-decoration: none; font-weight: 600;">{my_portfolio}</a></p>
            <p>Would you have 10 minutes this week for a brief call to see if there is an opportunity to collaborate?</p>
            <br>
            <p style="margin-bottom: 4px;">Best regards,</p>
            <p style="margin: 0; font-weight: 600;">{my_name}</p>
            <p style="margin: 0; color: #57606a;">Shopify & Full-Stack Developer</p>
            {f'<p style="margin: 0; color: #57606a;">Phone / WhatsApp: {my_phone}</p>' if my_phone else ''}
            {f'<p style="margin: 0;"><a href="{my_linkedin}" style="color: #0969da; text-decoration: none;">LinkedIn Profile</a></p>' if my_linkedin and my_linkedin != '#' else ''}
        </div>
        """
    elif cat == "laravel_react":
        subject = f"Full-Stack Developer (Laravel + React.js) - Application for {company}"
        body_html = f"""
        <div style="{styles}">
            <p>Hi {name},</p>
            <p>I hope you're doing well! I'm reaching out to express my keen interest in remote full-stack engineering opportunities at <strong>{company}</strong>.</p>
            <p>I specialize in building scalable web applications with <strong>Laravel and React.js</strong>:</p>
            <ul style="padding-left: 20px; line-height: 1.8;">
                <li><strong>Backend Architecture:</strong> RESTful & GraphQL APIs, queues, database schema design (PostgreSQL/MySQL), and auth systems in Laravel.</li>
                <li><strong>Modern Frontend:</strong> Interactive UIs using React.js, Next.js, state management, and modern component architecture.</li>
                <li><strong>Full-Stack Integrations:</strong> Inertia.js / SPA setups, third-party payment gateways, and real-time event handling.</li>
            </ul>
            <p>I am experienced working in distributed remote teams, prioritizing clean code, testability, and fast shipping.</p>
            <p><strong>Live Projects & GitHub:</strong> <a href="{my_portfolio}" style="color: #0969da; text-decoration: none; font-weight: 600;">{my_portfolio}</a></p>
            <p>Are you open for a brief 10-minute introductory chat this week?</p>
            <br>
            <p style="margin-bottom: 4px;">Best regards,</p>
            <p style="margin: 0; font-weight: 600;">{my_name}</p>
            <p style="margin: 0; color: #57606a;">Full-Stack Engineer (React / Laravel)</p>
            {f'<p style="margin: 0; color: #57606a;">Phone / WhatsApp: {my_phone}</p>' if my_phone else ''}
            {f'<p style="margin: 0;"><a href="{my_linkedin}" style="color: #0969da; text-decoration: none;">LinkedIn Profile</a></p>' if my_linkedin and my_linkedin != '#' else ''}
        </div>
        """
    elif cat == "wordpress":
        subject = f"WordPress & WooCommerce Developer - Available for {company}"
        body_html = f"""
        <div style="{styles}">
            <p>Hi {name},</p>
            <p>I hope you're having a great week! I came across <strong>{company}</strong> and wanted to offer my remote development support for your web projects.</p>
            <p>I specialize in <strong>custom WordPress and WooCommerce development</strong>:</p>
            <ul style="padding-left: 20px; line-height: 1.8;">
                <li><strong>Custom Plugins & Themes:</strong> Building bespoke plugins, custom post types, and tailored themes without relying on bloated builders.</li>
                <li><strong>WooCommerce Customization:</strong> Custom checkout flows, payment gateway integrations, and tailored store logic.</li>
                <li><strong>Gutenberg & Headless:</strong> Custom React-powered Gutenberg blocks and Headless WordPress implementations with REST/GraphQL.</li>
            </ul>
            <p>If your team has development backlog or needs a reliable developer to take on custom WordPress work, I'd love to assist.</p>
            <p><strong>Portfolio & Demos:</strong> <a href="{my_portfolio}" style="color: #0969da; text-decoration: none; font-weight: 600;">{my_portfolio}</a></p>
            <p>Would you have time for a short conversation this week?</p>
            <br>
            <p style="margin-bottom: 4px;">Best regards,</p>
            <p style="margin: 0; font-weight: 600;">{my_name}</p>
            <p style="margin: 0; color: #57606a;">WordPress & WooCommerce Developer</p>
            {f'<p style="margin: 0; color: #57606a;">Phone / WhatsApp: {my_phone}</p>' if my_phone else ''}
            {f'<p style="margin: 0;"><a href="{my_linkedin}" style="color: #0969da; text-decoration: none;">LinkedIn Profile</a></p>' if my_linkedin and my_linkedin != '#' else ''}
        </div>
        """
    else:  # fullstack / all
        subject = f"Full-Stack Web Developer (React / Laravel / Shopify / WP) - Available for {company}"
        body_html = f"""
        <div style="{styles}">
            <p>Hi {name},</p>
            <p>I hope you're having a great week! I've been following the work <strong>{company}</strong> delivers and wanted to reach out regarding remote development capacity.</p>
            <p>I am a versatile full-stack web developer with proven experience across:</p>
            <ul style="padding-left: 20px; line-height: 1.8;">
                <li><strong>Shopify:</strong> Custom app development (GraphQL / Remix / Node), Liquid theme customization, and Storefront APIs.</li>
                <li><strong>React.js & Laravel:</strong> Modern SPAs, robust API backends, relational databases, and SaaS architecture.</li>
                <li><strong>WordPress & WooCommerce:</strong> Custom plugin development, React Gutenberg blocks, and performance optimization.</li>
            </ul>
            <p>Whether your team requires overflow bandwidth for client agency projects or a dedicated full-stack engineer for product builds, I can deliver clean, maintainable solutions.</p>
            <p><strong>Portfolio & Projects:</strong> <a href="{my_portfolio}" style="color: #0969da; text-decoration: none; font-weight: 600;">{my_portfolio}</a></p>
            <p>Would you have 10 minutes for a brief introductory call this week?</p>
            <br>
            <p style="margin-bottom: 4px;">Best regards,</p>
            <p style="margin: 0; font-weight: 600;">{my_name}</p>
            <p style="margin: 0; color: #57606a;">Full-Stack & E-Commerce Developer</p>
            {f'<p style="margin: 0; color: #57606a;">Phone / WhatsApp: {my_phone}</p>' if my_phone else ''}
            {f'<p style="margin: 0;"><a href="{my_linkedin}" style="color: #0969da; text-decoration: none;">LinkedIn Profile</a></p>' if my_linkedin and my_linkedin != '#' else ''}
        </div>
        """

    return subject, body_html
