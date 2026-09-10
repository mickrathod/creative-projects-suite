import os
import sys
from PIL import Image as PILImage
from reportlab.lib import colors
from reportlab.lib.pagesizes import letter, A4
from reportlab.lib.units import inch
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, Image, PageBreak, KeepTogether, HRFlowable
)
from reportlab.pdfgen import canvas

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
IMG_DIR = os.path.join(BASE_DIR, "public", "exercises")
PDF_OUTPUT = os.path.join(BASE_DIR, "Winter_Arc_Protocol_Guide.pdf")

class NumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super(NumberedCanvas, self).__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_number(num_pages)
            super(NumberedCanvas, self).showPage()
        super(NumberedCanvas, self).save()

    def draw_page_number(self, page_count):
        if self._pageNumber == 1:
            # Skip cover page
            return
        self.saveState()
        self.setFont("Helvetica-Bold", 8)
        self.setFillColor(colors.HexColor("#06b6d4"))
        self.drawString(36, 25, "WINTER ARC PROTOCOL // 70KG TO 62KG RECOMPOSITION")
        
        self.setFont("Helvetica", 8)
        self.setFillColor(colors.HexColor("#64748b"))
        page_text = f"Page {self._pageNumber} of {page_count}"
        self.drawRightString(559, 25, page_text)
        
        self.setStrokeColor(colors.HexColor("#1e293b"))
        self.setLineWidth(0.5)
        self.line(36, 35, 559, 35)
        self.restoreState()

def get_fitted_image(img_name, max_w=240, max_h=160):
    img_path = os.path.join(IMG_DIR, img_name)
    if not os.path.exists(img_path):
        return None
    try:
        with PILImage.open(img_path) as im:
            orig_w, orig_h = im.size
            ratio = min(max_w / orig_w, max_h / orig_h)
            w = orig_w * ratio
            h = orig_h * ratio
            return Image(img_path, width=w, height=h)
    except Exception as e:
        print(f"Error loading image {img_name}: {e}")
        return None

def build_pdf():
    doc = SimpleDocTemplate(
        PDF_OUTPUT,
        pagesize=A4,
        leftMargin=36,
        rightMargin=36,
        topMargin=36,
        bottomMargin=45
    )
    
    styles = getSampleStyleSheet()
    
    # Custom styles
    c_primary = colors.HexColor("#0f172a")
    c_accent_cyan = colors.HexColor("#0284c7")
    c_accent_amber = colors.HexColor("#d97706")
    c_dark = colors.HexColor("#090d16")
    c_text = colors.HexColor("#1e293b")
    c_muted = colors.HexColor("#475569")
    
    title_style = ParagraphStyle(
        'CoverTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=26,
        leading=32,
        textColor=colors.HexColor("#0f172a"),
        alignment=1, # Center
        spaceAfter=8
    )
    
    subtitle_style = ParagraphStyle(
        'CoverSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=13,
        leading=17,
        textColor=colors.HexColor("#0284c7"),
        alignment=1,
        spaceAfter=15
    )
    
    h1_style = ParagraphStyle(
        'Header1',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=16,
        leading=20,
        textColor=colors.HexColor("#0f172a"),
        spaceBefore=14,
        spaceAfter=8,
        keepWithNext=True
    )
    
    h2_style = ParagraphStyle(
        'Header2',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=12,
        leading=16,
        textColor=colors.HexColor("#0369a1"),
        spaceBefore=8,
        spaceAfter=4,
        keepWithNext=True
    )

    body_style = ParagraphStyle(
        'StandardBody',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9.5,
        leading=13.5,
        textColor=c_text,
        spaceAfter=6
    )

    bold_body_style = ParagraphStyle(
        'BoldBody',
        parent=body_style,
        fontName='Helvetica-Bold'
    )

    callout_style = ParagraphStyle(
        'CalloutText',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=13,
        textColor=colors.HexColor("#0c4a6e")
    )
    
    table_text = ParagraphStyle(
        'TableText',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=11.5,
        textColor=c_text
    )

    table_header = ParagraphStyle(
        'TableHeader',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=9,
        leading=12,
        textColor=colors.white
    )

    story = []

    # ==================== COVER / BANNER ====================
    story.append(Spacer(1, 10))
    story.append(Paragraph("❄️ WINTER ARC PROTOCOL", subtitle_style))
    story.append(Paragraph("70 KG TO 62 KG RECOMPOSITION HANDBOOK", title_style))
    story.append(Paragraph("<b>Calisthenics Conditioning • Freestanding Handstand • Skateboarding Mastery • Zero-Crash Nutrition</b>", subtitle_style))
    story.append(Spacer(1, 6))

    # Athlete Snapshot Box
    snapshot_data = [
        [
            Paragraph("<b>ATHLETE PROFILE</b><br/>Height: <b>165 cm</b><br/>Starting Weight: <b>70.0 kg</b><br/>Target Weight: <b>62.0 kg</b><br/>Total Fat Loss: <b>8.0 kg (pure fat)</b>", callout_style),
            Paragraph("<b>DAILY ANCHORS TARGET</b><br/>Daily Calorie Ceiling: <b>1,800 kcal</b><br/>Daily Protein Anchor: <b>135g</b><br/>Daily Hydration: <b>3.5 Liters</b><br/>Calorie Deficit: <b>-550 kcal / day</b>", callout_style)
        ]
    ]
    snap_table = Table(snapshot_data, colWidths=[260, 260])
    snap_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor("#f0f9ff")),
        ('BOX', (0, 0), (-1, -1), 1.5, colors.HexColor("#38bdf8")),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('TOPPADDING', (0, 0), (-1, -1), 8),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
        ('LEFTPADDING', (0, 0), (-1, -1), 10),
        ('RIGHTPADDING', (0, 0), (-1, -1), 10),
    ]))
    story.append(snap_table)
    story.append(Spacer(1, 12))

    # ==================== SECTION 1: THE CALORIE & WEIGHT LOSS BLUEPRINT ====================
    story.append(Paragraph("1. THE TRANSFORMATION BLUEPRINT & CALORIE MATH", h1_style))
    story.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor("#0284c7"), spaceAfter=8))
    
    story.append(Paragraph(
        "<b>Can you drop from 70 kg to 62 kg with this routine?</b><br/>"
        "<b>YES, 100% Guaranteed by Human Physiology.</b> At 165 cm, carrying 70 kg means you have approximately 8 kg of excess adipose tissue (fat). By combining calisthenics (which signals your body to retain muscle) with daily skateboarding (which accelerates calorie burn) and a calibrated calorie deficit, you force your body to metabolize 100% stored fat without muscle loss.",
        body_style
    ))
    
    cal_table_data = [
        [Paragraph("Metric / Component", table_header), Paragraph("Calculation / Formula", table_header), Paragraph("Daily Calories", table_header)],
        [Paragraph("<b>BMR</b> (Basal Metabolic Rate)", table_text), Paragraph("Mifflin-St Jeor formula for 70 kg, 165 cm", table_text), Paragraph("<b>~1,600 kcal</b>", table_text)],
        [Paragraph("<b>NEAT</b> (Daily Movement)", table_text), Paragraph("Walking, standing, daily life chores", table_text), Paragraph("<b>+ 300 kcal</b>", table_text)],
        [Paragraph("<b>EAT</b> (Calisthenics & Skate)", table_text), Paragraph("30m zero-equipment circuit + 45m skateboarding", table_text), Paragraph("<b>+ 450 kcal</b>", table_text)],
        [Paragraph("<b>TDEE</b> (Total Daily Burn)", table_text), Paragraph("Total energy expended by your body each day", table_text), Paragraph("<b>~2,350 kcal</b>", table_text)],
        [Paragraph("<b>YOUR EATING TARGET</b>", table_header), Paragraph("Target daily calorie consumption", table_header), Paragraph("<b>1,750 - 1,800 kcal</b>", table_header)],
        [Paragraph("<b>NET DAILY DEFICIT</b>", table_text), Paragraph("2,350 burned - 1,800 consumed", table_text), Paragraph("<b>-550 kcal / day</b>", table_text)],
    ]
    cal_t = Table(cal_table_data, colWidths=[150, 240, 130])
    cal_t.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor("#0f172a")),
        ('BACKGROUND', (0, 5), (-1, 5), colors.HexColor("#0284c7")),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor("#cbd5e1")),
        ('ROWBACKGROUNDS', (0, 1), (-1, 4), [colors.HexColor("#f8fafc"), colors.white]),
        ('BACKGROUND', (0, 6), (-1, 6), colors.HexColor("#fef3c7")),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('TOPPADDING', (0, 0), (-1, -1), 5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
        ('LEFTPADDING', (0, 0), (-1, -1), 6),
        ('RIGHTPADDING', (0, 0), (-1, -1), 6),
    ]))
    story.append(cal_t)
    story.append(Spacer(1, 8))

    story.append(Paragraph(
        "<b>Why eat 1,800 kcal instead of starving at 1,300 kcal?</b><br/>"
        "• <b>Prevents Metabolic Crash:</b> Eating 1,300 kcal shocks your thyroid and drops your metabolic rate, causing quick weight-loss plateaus and extreme rebound bingeing.<br/>"
        "• <b>Guarantees Muscle Preservation:</b> Calisthenics and handstands demand intense neurological recovery. 1,800 kcal with 135g protein keeps your muscles rock-hard so you drop <b>pure fat</b>.<br/>"
        "• <b>8 kg Fat Loss Timeline:</b> 8 kg fat = ~61,600 kcal. At -550 kcal/day, 61,600 ÷ 550 = <b>~112 days (14-16 weeks)</b> of clean, consistent, permanent transformation.",
        body_style
    ))
    story.append(Spacer(1, 10))
    story.append(PageBreak())

    # ==================== SECTION 2: MEAL PLAN & INDIAN DIET UPGRADE ====================
    story.append(Paragraph("2. COMPLETE NUTRITION & INDIAN MEAL UPGRADE", h1_style))
    story.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor("#0284c7"), spaceAfter=8))
    
    story.append(Paragraph(
        "<b>Upgrading Your Current Diet (7 Rotis + Sabzi + Chai):</b><br/>"
        "Your current food is great home-cooked fuel, but it contains <b>only ~28g of protein</b>. With low protein, your body burns your shoulders and arm muscle instead of fat. We don't eliminate your rotis—we simply reduce 1 roti at lunch and dinner and replace it with real protein.",
        body_style
    ))

    diet_table_data = [
        [Paragraph("Meal Timing", table_header), Paragraph("Recommended Food & Upgrades", table_header), Paragraph("Approx Macros", table_header)],
        [
            Paragraph("<b>Morning</b><br/>(8:00 AM)", table_text),
            Paragraph("• 1 Cup Chai (low sugar)<br/>• 1 Roti (light ghee)<br/>• <b>ADD:</b> 2-3 Boiled Eggs OR 100g Paneer Bhurji OR Besan/Sprouts Chilla", table_text),
            Paragraph("<b>350 kcal</b><br/>18g Protein<br/>35g Carbs", table_text)
        ],
        [
            Paragraph("<b>Lunch</b><br/>(1:00 PM)", table_text),
            Paragraph("• <b>2 Rotis</b> (reduced from 3)<br/>• 1 bowl seasonal Sabzi<br/>• <b>ADD PROTEIN:</b> 1 large bowl thick Dal/Rajma + 50g Soya chunks OR 120g Chicken breast curry<br/>• 1 sliced cucumber & tomato", table_text),
            Paragraph("<b>550 kcal</b><br/>38g Protein<br/>60g Carbs", table_text)
        ],
        [
            Paragraph("<b>Pre-Skate / Evening</b><br/>(5:00 PM)", table_text),
            Paragraph("• 1 Banana (quick glycogen for skating & ollies)<br/>• 1 Scoop Whey Protein in water (or 1 glass milk + 2 boiled egg whites)", table_text),
            Paragraph("<b>250 kcal</b><br/>26g Protein<br/>28g Carbs", table_text)
        ],
        [
            Paragraph("<b>Dinner</b><br/>(8:30 PM)", table_text),
            Paragraph("• <b>2 Rotis</b> (reduced from 3)<br/>• 1 bowl Sabzi<br/>• <b>ADD:</b> 100g Paneer OR 3 Boiled Eggs (1 whole + 2 whites) OR Fish/Chicken OR thick Dal + 1 bowl curd (Dahi)", table_text),
            Paragraph("<b>520 kcal</b><br/>35g Protein<br/>50g Carbs", table_text)
        ],
        [
            Paragraph("<b>DAILY TOTALS</b>", table_header),
            Paragraph("<b>Balanced Indian Home Food + Optimal Athletic Fuel</b>", table_header),
            Paragraph("<b>~1,700 - 1,800 kcal<br/>125g - 135g Protein</b>", table_header)
        ],
    ]
    diet_t = Table(diet_table_data, colWidths=[90, 310, 120])
    diet_t.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor("#0f172a")),
        ('BACKGROUND', (0, 4), (-1, 4), colors.HexColor("#059669")),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor("#cbd5e1")),
        ('ROWBACKGROUNDS', (0, 1), (-1, 3), [colors.white, colors.HexColor("#f8fafc")]),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('TOPPADDING', (0, 0), (-1, -1), 5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
        ('LEFTPADDING', (0, 0), (-1, -1), 6),
        ('RIGHTPADDING', (0, 0), (-1, -1), 6),
    ]))
    story.append(diet_t)
    story.append(Spacer(1, 8))

    # Indian Food Macro Cheat-Sheet
    story.append(Paragraph("<b>Top Indian Protein Sources for Your Shopping List:</b>", bold_body_style))
    story.append(Paragraph(
        "• <b>Soya Chunks:</b> 50g uncooked = <b>26g protein</b>, ~170 kcal (Extremely cheap, soak in warm water, squeeze & cook with sabzi/curry).<br/>"
        "• <b>Eggs:</b> 3 whole eggs = <b>18g protein</b>, ~210 kcal (Fastest breakfast, boiled or omelette with onions and chilies).<br/>"
        "• <b>Low-Fat Paneer:</b> 100g = <b>18g - 20g protein</b>, ~240 kcal.<br/>"
        "• <b>Chicken Breast:</b> 150g = <b>45g protein</b>, ~220 kcal (The leanest source of pure protein).<br/>"
        "• <b>Thick Dal / Rajma / Chana:</b> 1 large bowl = <b>10g - 14g protein</b> + dietary fiber.<br/>"
        "• <b>Whey Protein:</b> 1 scoop = <b>24g - 26g protein</b>, ~120 kcal (Zero cooking, instant post-workout/skate shake).",
        body_style
    ))
    
    story.append(PageBreak())

    # ==================== SECTION 3: CALISTHENICS ROUTINE ====================
    story.append(Paragraph("3. ZERO-EQUIPMENT CALISTHENICS ROUTINE (FULL BODY)", h1_style))
    story.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor("#0284c7"), spaceAfter=8))
    story.append(Paragraph(
        "<b>Frequency:</b> 3 to 4 days per week (e.g., Monday, Wednesday, Friday, Saturday).<br/>"
        "<b>Structure:</b> Perform as a circuit or straight sets. Rest 60s between sets. Zero gym equipment required.",
        body_style
    ))

    exercises = [
        {
            "name": "1. Pike Push-ups",
            "img": "pike-pushup.jpg",
            "target": "Front Deltoids, Upper Chest, Triceps",
            "sets": "3 Sets × 8 - 10 Reps (60s rest)",
            "synergy": "Direct Shoulder Power for Handstands",
            "cues": "Form an inverted 'V'. Lower your head forward into a tripod triangle in front of your hands. Press back up and push your head through shoulders at top."
        },
        {
            "name": "2. Classic / Diamond Push-ups",
            "img": "pushup.jpg",
            "target": "Pectorals, Triceps, Anterior Shoulders",
            "sets": "3 Sets × 12 - 15 Reps (60s rest)",
            "synergy": "Upper Body Density & Pushing Strength",
            "cues": "Keep elbows tucked at 45 degrees, body rigid as a plank. Full range of motion—touch chest to floor, lock out elbows cleanly at top."
        },
        {
            "name": "3. Doorframe / Table Inverted Rows",
            "img": "row.jpg",
            "target": "Lats, Rhomboids, Scapular Retractors, Biceps",
            "sets": "3 Sets × 10 - 12 Reps (60s rest)",
            "synergy": "Shoulder Health, Scapular Control & Balance",
            "cues": "Grip the vertical side of a sturdy doorframe or lie under a heavy table. Keep core tight and pull your chest to hands, squeezing shoulder blades together."
        },
        {
            "name": "4. Bodyweight Squats + Calf Explosions",
            "img": "squat.jpg",
            "target": "Quads, Glutes, Calves, Achilles Tendon",
            "sets": "3 Sets × 15 - 20 Reps (45s rest)",
            "synergy": "Skateboarding Pop, Ollie Spring & Ankle Armor",
            "cues": "Squat down until thighs are parallel or below. Explode upward onto the balls of your toes for a 1-second calf contraction at the peak."
        },
        {
            "name": "5. Alternating Reverse Lunges",
            "img": "lunge.jpg",
            "target": "Glutes, Hamstrings, Single-Leg Stabilizers",
            "sets": "3 Sets × 10 Reps / leg (45s rest)",
            "synergy": "Single-Leg Balance for Skate Board Pushing",
            "cues": "Step smoothly backward, lower back knee until 1 inch off floor. Keep front knee tracking over toes. Drives stability on the skateboard."
        },
        {
            "name": "6. Hollow Body Hold / Rocks",
            "img": "hollow-body.jpg",
            "target": "Rectus Abdominis, Transverse Core, Pelvic Tilt",
            "sets": "3 Sets × 30 - 45 Seconds (45s rest)",
            "synergy": "Anti-Extension Core: Eliminates 'Banana' Handstand",
            "cues": "Lie on back. Glue your lower back into the ground—no gap. Arms glued by ears, toes pointed, lift legs and shoulder blades 4 inches off floor."
        }
    ]

    for ex in exercises:
        img_obj = get_fitted_image(ex["img"], max_w=160, max_h=105)
        text_cell = [
            Paragraph(f"<b>{ex['name']}</b>", h2_style),
            Paragraph(f"<b>Target:</b> {ex['target']}", table_text),
            Paragraph(f"<b>Volume:</b> {ex['sets']}", table_text),
            Paragraph(f"<b>Synergy:</b> <font color='#0284c7'><b>{ex['synergy']}</b></font>", table_text),
            Paragraph(f"<b>Cues:</b> {ex['cues']}", table_text),
        ]
        
        row_data = [[img_obj if img_obj else Paragraph("[Image]", table_text), text_cell]]
        card_t = Table(row_data, colWidths=[170, 350])
        card_t.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor("#f8fafc")),
            ('BOX', (0, 0), (-1, -1), 1, colors.HexColor("#cbd5e1")),
            ('VALIGN', (0, 0), (-1, -1), 'TOP'),
            ('TOPPADDING', (0, 0), (-1, -1), 4),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
            ('LEFTPADDING', (0, 0), (-1, -1), 6),
            ('RIGHTPADDING', (0, 0), (-1, -1), 6),
        ]))
        story.append(card_t)
        story.append(Spacer(1, 4))

    story.append(PageBreak())

    # ==================== SECTION 4: HANDSTAND MASTERY ====================
    story.append(Paragraph("4. FREESTANDING HANDSTAND MASTERY ROADMAP", h1_style))
    story.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor("#0284c7"), spaceAfter=8))
    story.append(Paragraph(
        "<b>Why dropping from 70 kg to 62 kg is a Cheat Code for Handstands:</b><br/>"
        "At 70 kg, your wrists and shoulders must balance 70 kilograms against gravity. When you hit 62 kg, you shed <b>8 kg of dead weight</b>. Your strength-to-weight ratio skyrockets, making your holds feel weightless!",
        body_style
    ))

    hs_stages = [
        {
            "stage": "STAGE 1: Wrist Armor & Scapular Foundation",
            "img": "wrist-armor.jpg",
            "goal": "Prepare wrists to support bodyweight & train shoulder elevation",
            "target": "Target: 30s pain-free hold",
            "cues": "• First-knuckle push-ups on knees (3 sets of 10)<br/>• Wrist rocks: palms down, fingers backward, rocks forward & sideways (2 mins)<br/>• Scapular push-ups: push the floor away at top, spreading shoulder blades"
        },
        {
            "stage": "STAGE 2: Hollow Body Floor Alignment",
            "img": "stage2-hollow.jpg",
            "goal": "Eliminate the 'banana arch' before going upside down",
            "target": "Target: 3 sets of 40s clean hold",
            "cues": "• Press lumbar spine flat into ground—zero daylight under back<br/>• Extend arms overhead, point toes, lift shoulders and legs 4 inches<br/>• Breathe into belly without letting lower back lift off the floor"
        },
        {
            "stage": "STAGE 3: Chest-to-Wall Handstand",
            "img": "stage3-wall.jpg",
            "goal": "The gold standard for straight-line overhead alignment",
            "target": "Target: 3 sets of 45s wall holds",
            "cues": "• Walk feet up the wall facing the wall (never back-to-wall)<br/>• Hands 6-10 inches from baseboard<br/>• Shrug shoulders up to ears (scapular elevation)<br/>• Arch fingertips like tiger claws (Cambré grip) to grip the floor"
        },
        {
            "stage": "STAGE 4: Wall Taps & Fingertip Balance Float",
            "img": "stage4-taps.jpg",
            "goal": "Learn how fingers act as brakes and accelerators",
            "target": "Target: 10s - 15s balance float",
            "cues": "• From chest-to-wall, press fingertips hard to peel toes 2 inches off wall<br/>• Find the 'sweet spot' where both feet float freely for 1-3 seconds<br/>• Master the cartwheel bail: pivot one hand and step down safely"
        },
        {
            "stage": "STAGE 5: Freestanding Kick-Up & Balance Hold",
            "img": "stage5-freestanding.jpg",
            "goal": "Full freestanding control and consistent entry",
            "target": "Winter Arc Target: 10s clean freestanding hold",
            "cues": "• Lock elbows BEFORE kicking up (never bend arms on entry)<br/>• Lead leg kicks up smoothly; trail leg joins like a compass needle<br/>• Squeeze glutes, point toes straight to sky, micro-press with fingertips"
        }
    ]

    for s in hs_stages:
        img_obj = get_fitted_image(s["img"], max_w=160, max_h=105)
        text_cell = [
            Paragraph(f"<b>{s['stage']}</b>", h2_style),
            Paragraph(f"<b>Goal:</b> {s['goal']}", table_text),
            Paragraph(f"<b>Benchmark:</b> <font color='#0284c7'><b>{s['target']}</b></font>", table_text),
            Paragraph(f"<b>Technical Cues:</b><br/>{s['cues']}", table_text),
        ]
        row_data = [[img_obj if img_obj else Paragraph("[Image]", table_text), text_cell]]
        card_t = Table(row_data, colWidths=[170, 350])
        card_t.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor("#f8fafc")),
            ('BOX', (0, 0), (-1, -1), 1, colors.HexColor("#cbd5e1")),
            ('VALIGN', (0, 0), (-1, -1), 'TOP'),
            ('TOPPADDING', (0, 0), (-1, -1), 4),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
            ('LEFTPADDING', (0, 0), (-1, -1), 6),
            ('RIGHTPADDING', (0, 0), (-1, -1), 6),
        ]))
        story.append(card_t)
        story.append(Spacer(1, 4))

    story.append(PageBreak())

    # ==================== SECTION 5: SKATEBOARDING ROADMAP ====================
    story.append(Paragraph("5. SKATEBOARDING PROGRESSION ROADMAP (CRUISING TO OLLIE)", h1_style))
    story.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor("#0284c7"), spaceAfter=8))
    story.append(Paragraph(
        "<b>Skateboarding as Cardio:</b> 45 minutes of skateboarding burns <b>~300 - 400 kcal</b> while developing extraordinary ankle stability, balance, and leg reactivity. It is the most fun, functional cardio in existence.",
        body_style
    ))

    skate_levels = [
        {
            "name": "Level 1: Stance & Stationary Balance",
            "img": "skate-stance.jpg",
            "sub": "Identify front foot (Regular: Left forward | Goofy: Right forward)",
            "cues": "• Stand tall, have someone gently nudge your back: whichever foot steps out first is your front foot!<br/>• Place front foot over front bolts at 30° angle. Back foot on tail bolts.<br/>• Bend knees, drop center of mass, shift weight gently toe-to-heel."
        },
        {
            "name": "Level 2: Controlled Pushing & Foot Braking",
            "img": "skate.jpg",
            "sub": "Smooth continuous propulsion & safe emergency stopping",
            "cues": "• Turn front foot straight along the deck.<br/>• Keep 80% of bodyweight over front bent knee.<br/>• Swing back foot forward and push straight back against the concrete.<br/>• Foot brake: lightly slide sole of pushing shoe along ground to decelerate."
        },
        {
            "name": "Level 3: Fluid Carving & Turning",
            "img": "skate-carve.jpg",
            "sub": "Transfer weight across truck bushings to steer lines",
            "cues": "• Lean gently into your toes for toe-side turn.<br/>• Drop weight into heels for heel-side turn.<br/>• Open your shoulders and look where you want to go—the board follows your head!"
        },
        {
            "name": "Level 4: Kickturns (Backside & Frontside 90°)",
            "img": "skate-kickturn.jpg",
            "sub": "Pivot on rear wheels to change direction instantly",
            "cues": "• Place back foot on pocket/tip of the tail.<br/>• Apply quick light downward pressure to lift front wheels 2 inches.<br/>• Lead with shoulders, pivot front wheels 45°-90°, and drop front trucks softly."
        },
        {
            "name": "Level 5: The Ollie (Groundwork to Rolling)",
            "img": "ollie.jpg",
            "sub": "The gateway to street skateboarding: pop, slide, and level out",
            "cues": "• Practice stationary in grass or sidewalk crack first.<br/>• Back foot snaps tail down against concrete (THE POP).<br/>• Front foot rolls onto outer pinky-toe edge and slides up to front bolts (THE SLIDE).<br/>• Tuck both knees into chest in mid-air, absorb landing with bent knees over bolts."
        }
    ]

    for sk in skate_levels:
        img_obj = get_fitted_image(sk["img"], max_w=160, max_h=105)
        text_cell = [
            Paragraph(f"<b>{sk['name']}</b>", h2_style),
            Paragraph(f"<b>Core Skill:</b> {sk['sub']}", table_text),
            Paragraph(f"<b>Step-by-Step Instructions:</b><br/>{sk['cues']}", table_text),
        ]
        row_data = [[img_obj if img_obj else Paragraph("[Image]", table_text), text_cell]]
        card_t = Table(row_data, colWidths=[170, 350])
        card_t.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor("#f8fafc")),
            ('BOX', (0, 0), (-1, -1), 1, colors.HexColor("#cbd5e1")),
            ('VALIGN', (0, 0), (-1, -1), 'TOP'),
            ('TOPPADDING', (0, 0), (-1, -1), 4),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
            ('LEFTPADDING', (0, 0), (-1, -1), 6),
            ('RIGHTPADDING', (0, 0), (-1, -1), 6),
        ]))
        story.append(card_t)
        story.append(Spacer(1, 4))

    story.append(PageBreak())

    # ==================== SECTION 6: DAILY PROTOCOL & CHECKLIST ====================
    story.append(Paragraph("6. DAILY PROTOCOL CHECKLIST & 90-DAY HABIT LOOP", h1_style))
    story.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor("#0284c7"), spaceAfter=8))
    
    story.append(Paragraph(
        "<b>The 4 Non-Negotiable Daily Anchors:</b> Execute these 4 anchors every day. On rest days, replace workout with walking/mobility.",
        body_style
    ))

    checklist_data = [
        [Paragraph("Anchor", table_header), Paragraph("Daily Requirement", table_header), Paragraph("Execution Strategy", table_header)],
        [
            Paragraph("<b>Anchor 1: Handstand</b>", table_text),
            Paragraph("10-15 mins daily practice", table_text),
            Paragraph("Wrist warmup + 3 sets chest-to-wall holds + balance floats", table_text)
        ],
        [
            Paragraph("<b>Anchor 2: Workout</b>", table_text),
            Paragraph("Full Body Calisthenics", table_text),
            Paragraph("3-4 days/week: Pike pushups, rows, squats, hollow holds", table_text)
        ],
        [
            Paragraph("<b>Anchor 3: Skate / Steps</b>", table_text),
            Paragraph("30-45m skate OR 9,000 steps", table_text),
            Paragraph("Cruising, foot-braking, carving or kickturns (~350 kcal burn)", table_text)
        ],
        [
            Paragraph("<b>Anchor 4: Nutrition</b>", table_text),
            Paragraph("Under 1,800 kcal & 135g protein", table_text),
            Paragraph("5 rotis max/day + eggs/paneer/soya chunks + 3.5L water", table_text)
        ],
    ]
    check_t = Table(checklist_data, colWidths=[120, 180, 220])
    check_t.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor("#0f172a")),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor("#cbd5e1")),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor("#f8fafc")]),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('TOPPADDING', (0, 0), (-1, -1), 6),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
        ('LEFTPADDING', (0, 0), (-1, -1), 6),
        ('RIGHTPADDING', (0, 0), (-1, -1), 6),
    ]))
    story.append(check_t)
    story.append(Spacer(1, 10))

    # Measurement Protocol
    story.append(Paragraph("<b>The Golden Rules of Weighing & Tracking:</b>", bold_body_style))
    story.append(Paragraph(
        "1. <b>Weigh yourself every morning:</b> Right after waking up, after emptying bladder, before eating or drinking water.<br/>"
        "2. <b>Ignore daily fluctuations:</b> Your weight can jump up or down 0.5 - 1 kg due to sodium (salt) or water retention. Pay attention to the <b>weekly average</b>.<br/>"
        "3. <b>Target Pace:</b> Aim for <b>0.5 kg to 0.7 kg fat loss per week</b>. In 12-14 weeks, you will cross the finish line at a razor-sharp <b>62.0 kg</b>!<br/>"
        "4. <b>Progress Photos:</b> Take one front, side, and back photo in consistent lighting every Sunday morning.",
        body_style
    ))
    story.append(Spacer(1, 10))

    # Sign-off Quote
    quote_data = [[
        Paragraph("<b>THE WINTER ARC CREED:</b><br/><i>'Discipline is choosing between what you want now and what you want most. In 90 days, you will walk into the room with 8 kg less fat, bulletproof shoulders, effortless balance upside down, and the freedom of riding a skateboard. Put in the work.'</i>", callout_style)
    ]]
    quote_t = Table(quote_data, colWidths=[520])
    quote_t.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor("#f1f5f9")),
        ('BOX', (0, 0), (-1, -1), 1.5, colors.HexColor("#64748b")),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('TOPPADDING', (0, 0), (-1, -1), 10),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 10),
        ('LEFTPADDING', (0, 0), (-1, -1), 12),
        ('RIGHTPADDING', (0, 0), (-1, -1), 12),
    ]))
    story.append(quote_t)

    # Build document
    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"SUCCESS: PDF generated at {PDF_OUTPUT}")

if __name__ == "__main__":
    build_pdf()
