from pathlib import Path
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import BaseDocTemplate, Frame, PageTemplate, PageBreak, Paragraph, Spacer, Table, TableStyle

OUT = Path("public/demo/Entimema_Financial_Intelligence_Northstar_FY2025.pdf")
NAVY = colors.HexColor("#071B4D")
ORANGE = colors.HexColor("#DE873D")
ICE = colors.HexColor("#F4F7FA")
PALE = colors.HexColor("#FFF8E6")
MID = colors.HexColor("#596A80")
LINE = colors.HexColor("#D5DCE5")
pdfmetrics.registerFont(TTFont("EntimemaSans", "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"))
pdfmetrics.registerFont(TTFont("EntimemaSans-Bold", "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"))
S0 = getSampleStyleSheet()
S = {
    "eye": ParagraphStyle("eye", parent=S0["Normal"], fontName="EntimemaSans-Bold", fontSize=7, leading=9, textColor=ORANGE, spaceAfter=7),
    "title": ParagraphStyle("title", parent=S0["Title"], fontName="EntimemaSans-Bold", fontSize=30, leading=32, textColor=NAVY, alignment=0, spaceAfter=14),
    "h1": ParagraphStyle("h1", parent=S0["Heading1"], fontName="EntimemaSans-Bold", fontSize=20, leading=23, textColor=NAVY, spaceAfter=13),
    "h2": ParagraphStyle("h2", parent=S0["Heading2"], fontName="EntimemaSans-Bold", fontSize=11, leading=14, textColor=NAVY, spaceAfter=6),
    "body": ParagraphStyle("body", parent=S0["BodyText"], fontName="EntimemaSans", fontSize=9, leading=14, textColor=NAVY, spaceAfter=8),
    "small": ParagraphStyle("small", parent=S0["BodyText"], fontName="EntimemaSans", fontSize=7.5, leading=11, textColor=MID),
    "metric": ParagraphStyle("metric", parent=S0["Normal"], fontName="EntimemaSans-Bold", fontSize=17, leading=20, textColor=NAVY),
    "cell": ParagraphStyle("cell", parent=S0["BodyText"], fontName="EntimemaSans", fontSize=8, leading=11, textColor=colors.black),
    "cellHeader": ParagraphStyle("cellHeader", parent=S0["BodyText"], fontName="EntimemaSans-Bold", fontSize=7.5, leading=10, textColor=colors.white),
}

def chrome(canvas, doc):
    w, h = A4
    canvas.saveState()
    canvas.setFillColor(NAVY); canvas.rect(0, h - 13*mm, w, 13*mm, fill=1, stroke=0)
    canvas.setFillColor(colors.white); canvas.setFont("EntimemaSans-Bold", 8); canvas.drawString(18*mm, h-8.5*mm, "E N T I M E M A")
    canvas.setFont("EntimemaSans", 6.5); canvas.drawRightString(w-18*mm, h-8.5*mm, "FINANCIAL INTELLIGENCE | DEMONSTRATION REPORT")
    canvas.setStrokeColor(LINE); canvas.line(18*mm, 15*mm, w-18*mm, 15*mm)
    canvas.setFillColor(MID); canvas.setFont("EntimemaSans", 6.3)
    canvas.drawString(18*mm, 10*mm, "Fictional company | Pre-validated demonstration data | Not financial advice")
    canvas.drawRightString(w-18*mm, 10*mm, f"{doc.page:02d}")
    canvas.restoreState()

def label(text): return Paragraph(text.upper(), S["eye"])
def metric(name, value, note): return [Paragraph(name.upper(), S["small"]), Paragraph(value, S["metric"]), Paragraph(note, S["small"])]

def box(title, text, bg=ICE):
    t = Table([[Paragraph(title, S["h2"]), Paragraph(text, S["body"])]], colWidths=[48*mm, 115*mm])
    t.setStyle(TableStyle([("BACKGROUND",(0,0),(-1,-1),bg),("BOX",(0,0),(-1,-1),.7,LINE),("LINEBEFORE",(0,0),(0,0),3,ORANGE),("VALIGN",(0,0),(-1,-1),"TOP"),("PADDING",(0,0),(-1,-1),10)]))
    return t

def grid(rows, widths, header=True):
    rendered = [[value if isinstance(value, Paragraph) else Paragraph(str(value), S["cellHeader"] if header and row_index == 0 else S["cell"]) for value in row] for row_index, row in enumerate(rows)]
    t = Table(rendered, colWidths=widths, repeatRows=1 if header else 0)
    style=[("GRID",(0,0),(-1,-1),.45,LINE),("VALIGN",(0,0),(-1,-1),"TOP"),("TOPPADDING",(0,0),(-1,-1),8),("BOTTOMPADDING",(0,0),(-1,-1),8),("LEFTPADDING",(0,0),(-1,-1),7),("RIGHTPADDING",(0,0),(-1,-1),7)]
    if header: style += [("BACKGROUND",(0,0),(-1,0),NAVY),("TEXTCOLOR",(0,0),(-1,0),colors.white),("FONT",(0,0),(-1,0),"EntimemaSans-Bold",7.5),("ROWBACKGROUNDS",(0,1),(-1,-1),[colors.white,ICE]),("FONT",(0,1),(-1,-1),"EntimemaSans",8)]
    t.setStyle(TableStyle(style)); return t

def generate():
    OUT.parent.mkdir(parents=True, exist_ok=True)
    doc=BaseDocTemplate(str(OUT),pagesize=A4,leftMargin=18*mm,rightMargin=18*mm,topMargin=24*mm,bottomMargin=21*mm,title="Financial Intelligence Demonstration Report - Northstar Manufacturing Ltd",author="Entimema")
    doc.addPageTemplates([PageTemplate(id="p",frames=[Frame(doc.leftMargin,doc.bottomMargin,doc.width,doc.height,id="f")],onPage=chrome)])
    story=[Spacer(1,8*mm),label("Financial Intelligence | V1"),Paragraph("A financial analysis<br/>you can inspect.",S["title"]),Paragraph("Northstar Manufacturing Ltd | Income Statement | FY 2025 | EUR",S["body"]),Spacer(1,4*mm),box("Demonstration scope","This sample uses a fictional company and pre-validated data to demonstrate Entimema's controlled workflow. It is not a customer analysis or a live execution.",PALE),Spacer(1,11*mm)]
    story += [grid([metric("Workflow status","Review ready","One mapping requires confirmation"),metric("Source","1 statement","Six reported lines retained"),metric("Control","Passed","Gross profit reconciles"),metric("Output","Traceable","Evidence and exceptions preserved")],[41*mm]*4,False),Spacer(1,13*mm),label("Decision use"),Paragraph("The report separates reported facts, deterministic calculations and items requiring human judgement. A decision-maker can inspect what is supported, what is calculated and what remains unresolved before relying on the output.",S["body"]),Spacer(1,6*mm)]
    flow=Table([["SOURCE","INTERPRET","VALIDATE","REVIEW","OUTPUT"]],colWidths=[32.8*mm]*5); flow.setStyle(TableStyle([("BACKGROUND",(0,0),(-1,-1),NAVY),("TEXTCOLOR",(0,0),(-1,-1),colors.white),("FONT",(0,0),(-1,-1),"EntimemaSans-Bold",7),("ALIGN",(0,0),(-1,-1),"CENTER"),("PADDING",(0,0),(-1,-1),10),("INNERGRID",(0,0),(-1,-1),.5,colors.HexColor("#45617E"))])); story.append(flow)

    story += [PageBreak(),label("01 | Executive summary"),Paragraph("What the statement supports.",S["h1"]),Paragraph("Northstar reports FY 2025 revenue of EUR 12.48m, gross profit of EUR 4.12m and EBITDA of EUR 1.36m. Gross margin is 33.0%, EBITDA margin is 10.9% and net margin is 6.6%.",S["body"]),Paragraph("The statement demonstrates positive profitability at each reported level. It does not establish earnings persistence or cash conversion. No comparative period, balance sheet, cash flow, budget or operational-driver evidence is included.",S["body"]),box("Review required","The source line 'Administrative and other' is provisionally mapped to Operating expenses. The value is retained exactly as reported, but the classification requires human confirmation.",PALE),Spacer(1,8*mm),grid([metric("Revenue","EUR 12.48m","Reported and traced"),metric("Gross margin","33.0%","Deterministic"),metric("EBITDA margin","10.9%","Deterministic"),metric("Net margin","6.6%","Deterministic")],[41*mm]*4,False),Spacer(1,9*mm),Paragraph("Decision interpretation",S["h2"]),Paragraph("The available evidence supports a profitability reading, not a complete financial-health conclusion. Credit, investment, liquidity or covenant use requires additional evidence and explicit decision criteria.",S["body"])]

    rows=[["Financial line","FY 2025","Origin","Status"],["Revenue","EUR 12,480,000","Reported","Traced"],["Cost of sales","(EUR 8,360,000)","Reported","Traced"],["Gross profit","EUR 4,120,000","Reported","Reconciled"],["Gross margin","33.0%","Calculated","Passed"],["Administrative and other","(EUR 2,760,000)","Reported","Review"],["EBITDA","EUR 1,360,000","Reported","Traced"],["EBITDA margin","10.9%","Calculated","Passed"],["Net income","EUR 820,000","Reported","Traced"],["Net margin","6.6%","Calculated","Passed"]]
    story += [PageBreak(),label("02 | Structured statement"),Paragraph("Reported values and controlled calculations.",S["h1"]),grid(rows,[57*mm,40*mm,32*mm,35*mm]),Spacer(1,8*mm),box("Gross profit reconciliation","EUR 12,480,000 revenue - EUR 8,360,000 cost of sales = EUR 4,120,000 gross profit. Difference: EUR 0. Status: passed.")]

    erows=[["Object","Evidence retained","Control conclusion"],["Revenue","Source label, period and EUR 12,480,000","Directly traced"],["Gross profit","Revenue and cost-of-sales lines","Arithmetic passed"],["Gross margin","Gross profit / Revenue","33.0%; deterministic"],["Administrative and other","Source label and EUR 2,760,000","Mapping review required"],["EBITDA margin","EBITDA / Revenue","10.9%; deterministic"],["Net margin","Net income / Revenue","6.6%; deterministic"]]
    story += [PageBreak(),label("03 | Evidence and control"),Paragraph("How each conclusion can be inspected.",S["h1"]),grid(erows,[42*mm,75*mm,47*mm]),Spacer(1,9*mm),box("Epistemic boundary","Reported values are facts within the supplied demonstration statement. Margins are deterministic derivations. The operating-expense mapping is a proposed interpretation. Future performance, liquidity and decision suitability remain unknown within this scope.",PALE)]

    rrows=[["Review item","Required action","Effect before resolution"],["Operating-expense mapping","Confirm the proposed canonical category.","Classification remains provisional."],["Comparative interpretation","Provide a prior period or budget.","No trend claim is supported."],["Cash conversion","Provide balance sheet and cash flow evidence.","Profitability is not treated as liquidity."],["Decision use","Define decision and materiality thresholds.","No approval or credit recommendation is issued."]]
    story += [PageBreak(),label("04 | Review and limitations"),Paragraph("What must happen before reliance.",S["h1"]),grid(rrows,[45*mm,72*mm,47*mm]),Spacer(1,10*mm),Paragraph("Next controlled step",S["h2"]),Paragraph("A paid pilot applies the same control logic to an agreed customer scope inside a restricted Entimema Workspace. Scope, formats, review responsibility, output and price are confirmed before execution.",S["body"]),Spacer(1,5*mm),box("Commercial path","Configure pilot -> confirm scope and offer -> pay securely -> receive restricted Workspace access -> run the agreed financial workflow.")]
    doc.build(story)

if __name__ == "__main__": generate()
