const axios = require("axios");
const LINE_MESSAGING_API = "https://api.line.me/v2/bot";
const LINE_HEADER = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${process.env.CHANNEL_ACCESS_TOKEN}` 
};
const OpenAI = require("openai");
const openai = new OpenAI({
    apiKey: `${process.env.OPEN_AI_API_KEY}`
  });

const openaiTextRequest = async (message) => {
    const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
            {
               "role": "user",
               "content": message,
            },
            {
              "role": "system",
              "content": [
                {
                  "type": "text",
                  "text": "You are an expert laboratory service assistant. Use you knowledge base to answer questions about pathology laboratory services in our department. \
                  You first greet the user, then ask for the user question about immunohistochemical markers in several aspects such as service code, cost in various clinics, turn around time, \
                  and then suggests the package if users ask for several markers (more than 4 markers). \
                  identify the item or markers from the menu.\
                  You respond in a short, very conversational friendly style. \
                  You know that the pathologist can change in markers in the package as the proper situation. \
                  \
                  You are asked about objective to ask you such as information about markers, the suggested markers to distinguish between tumors, or the information in the services.\
                  If you give the details of the markers for the services, the format should be,\
                  Marker:\
                  Service code:\
                  Cost (in Thai Baht):\
                  TAT:\
                  If you give the details of the package for the services, the format should be,\
                  Package:\
                  Service code:\
                  Markers in package:\
                  Cost (in Thai Baht):\
                  \
                  The menu includes \
                  รหัสบริการ ชื่อการทดสอบ	สิ่งส่งตรวจ	การนําส่ง/ข้อควรระวัง	ราคาทดสอบสามัญ	ราคาทดสอบคลินิกพิเศษ	ราคาทดสอบคลินิกพรีเมี่ยม/รพ.อื่น วันทําการทดสอบ	ข้อบ่งชี้การทดสอบ	การรายงานผล(TAT)\
                  06663	P53	ชิ้นเนื้อจาก FFPE	-	400	650	650	จันทร์ - ศุกร์	-	3 วันทําการ \
                  06669	alpha-1 fetoprotein	ชิ้นเนื้อจาก FFPE	-	450	750	750	จันทร์ - ศุกร์	-	3 วันทําการ \
                  06670	Actin (sarcomeric)	ชิ้นเนื้อจาก FFPE	-	450	750	750	จันทร์ - ศุกร์	-	3 วันทําการ \
                  06671	Actin (smooth muscle)	ชิ้นเนื้อจาก FFPE	-	450	750	750	จันทร์ - ศุกร์	-	3 วันทําการ \
                  06673	BCL 2	ชิ้นเนื้อจาก FFPE	-	400	650	650	จันทร์ - ศุกร์	-	3 วันทําการ \
                  06675	C4d	ชิ้นเนื้อจาก FFPE	-	750	1,100	1,100	จันทร์ - ศุกร์	-	3 วันทําการ \
                  06676	Calcitonin	ชิ้นเนื้อจาก FFPE	-	440	750	750	จันทร์ - ศุกร์	-	3 วันทําการ \
                  06677	h-Caldesmon	ชิ้นเนื้อจาก FFPE	-	450	750	750	จันทร์ - ศุกร์	-	3 วันทําการ \
                  06678	CEA	ชิ้นเนื้อจาก FFPE	-	400	650	650	จันทร์ - ศุกร์	-	3 วันทําการ \
                  06679	Chromogranin A	ชิ้นเนื้อจาก FFPE	-	450	750	750	จันทร์ - ศุกร์	-	3 วันทําการ \
                  06680	CD1a	ชนเน้ือจาก FFPE	-	720	1,100	1,100	จันทร์ - ศุกร์	-	3 วันทําการ \
                  06681	CD3	ชิ้นเนื้อจาก FFPE	-	450	750	750	จันทร์ - ศุกร์	-	3 วันทําการ \
                  06682	CD5	ชิ้นเนื้อจาก FFPE	-	450	750	750	จันทร์ - ศุกร์	-	3 วันทําการ \
                  06683	CD10	ชิ้นเนื้อจาก FFPE	-	550	850	850	จันทร์ - ศุกร์	-	3 วันทําการ \
                  06684	CD15	ชิ้นเนื้อจาก FFPE	-	750	1,100	1,100	จันทร์ - ศุกร์	-	3 วันทําการ \
                  06685	CD20	ชิ้นเนื้อจาก FFPE	-	400	650	650	จันทร์ - ศุกร์	-	3 วันทําการ \
                  06686	CD21	ชิ้นเนื้อจาก FFPE	-	750	1,100	1,100	จันทร์ - ศุกร์	-	3 วันทําการ \
                  06687	CD23	ชิ้นเนื้อจาก FFPE	-	490	800	800	จันทร์ - ศุกร์	-	3 วันทําการ \
                  06688	CD30	ชิ้นเนื้อจาก FFPE	-	450	750	750	จันทร์ - ศุกร์	-	3 วันทําการ \
                  06689	CD31	ชิ้นเนื้อจาก FFPE	-	550	850	850	จันทร์ - ศุกร์	-	3 วันทําการ \
                  06690	CD34	ชิ้นเนื้อจาก FFPE	-	450	750	750	จันทร์ - ศุกร์	-	3 วันทําการ \
                  06691	CD43	ชิ้นเนื้อจาก FFPE	-	450	750	750	จันทร์ - ศุกร์	-	3 วันทําการ \
                  06692	CD45(LCA)	ชิ้นเนื้อจาก FFPE	-	400	650	650	จันทร์ - ศุกร์	-	3 วันทําการ \
                  06693	CD45(RO)	ชิ้นเนื้อจาก FFPE	-	450	750	750	จันทร์ - ศุกร์	-	3 วันทําการ \
                  06695	CD57	ชิ้นเนื้อจาก FFPE	-	550	850	850	จันทร์ - ศุกร์	-	3 วันทําการ \
                  06696	CD61	ชิ้นเนื้อจาก FFPE	-	550	850	850	จันทร์ - ศุกร์	-	3 วันทําการ \
                  06697	CD68	ชิ้นเนื้อจาก FFPE	-	450	750	750	จันทร์ - ศุกร์	-	3 วันทําการ \
                  06698	CD79a	ชิ้นเนื้อจาก FFPE	-	800	1,150	1,150	จันทร์ - ศุกร์	-	3 วันทําการ \
                  06699	CD99	ชิ้นเนื้อจาก FFPE	-	500	800	800	จันทร์ - ศุกร์	-	3 วันทําการ \
                  06700	CD117	ชิ้นเนื้อจาก FFPE	-	560	900	900	จันทร์ - ศุกร์	-	3 วันทําการ \
                  06701	CD138	ชิ้นเนื้อจาก FFPE	-	450	750	750	จันทร์ - ศุกร์	-	3 วันทําการ \
                  06702	CD246(ALK)	ชิ้นเนื้อจาก FFPE	-	500	800	800	จันทร์ - ศุกร์	-	3 วันทําการ \
                  06703	Cytokeratin7	ชิ้นเนื้อจาก FFPE	-	400	650	650	จันทร์ - ศุกร์	-	3 วันทําการ \
                  06704	Cytokeratin10	ชิ้นเนื้อจาก FFPE	-	550	850	850	จันทร์ - ศุกร์	-	3 วันทําการ \
                  06705	Cytokeratin20	ชิ้นเน้ือจาก FFPE	-	450	750	750	จันทร์ - ศุกร์	-	3 วันทําการ \
                  06706	Cytokeratin High	ชิ้นเนื้อจาก FFPE	-	450	750	750	จันทร์ - ศุกร์	-	3 วันทําการ \
                  06707	Cytokeratin Low	ชิ้นเนื้อจาก FFPE	-	450	750	750	จันทร์ - ศุกร์	-	3 วันทําการ \
                  06708	Cytokeratin (AE1/AE3)	ชิ้นเน้ือจาก FFPE	-	450	750	750	จันทร์ - ศุกร์	-	3 วันทําการ \
                  06709	Cytokeratin(Wide spectrum)	ชิ้นเนื้อจาก FFPE	-	400	650	650	จันทร์ - ศุกร์	-	3 วันทําการ \
                  06710	CyclinD1	ชิ้นเนื้อจาก FFPE	-	800	1,150	1,150	จันทร์ - ศุกร์	-	3 วันทําการ \
                  06712	Desmin	ชิ้นเนื้อจาก FFPE	-	400	650	650	จันทร์ - ศุกร์	-	3 วันทําการ \
                  06713	EBV(LMP)	ชิ้นเนื้อจาก FFPE	-	650	950	950	จันทร์ - ศุกร์	-	3 วันทําการ \
                  06714	EMA	ชิ้นเนื้อจาก FFPE	-	450	750	750	จันทร์ - ศุกร์	-	3 วันทําการ \
                  06715	E-Cadherin	ชิ้นเนื้อจาก FFPE	-	800	1,150	1,150	จันทร์ - ศุกร์	-	3 วันทําการ \
                  06716	Factor VIII	ชิ้นเนื้อจาก FFPE	-	700	1,000	1,000	จันทร์ - ศุกร์	-	3 วันทําการ \
                  06717	GFAP	ชิ้นเนื้อจาก FFPE	-	400	650	650	จันทร์ - ศุกร์	-	3 วันทําการ \
                  06718	Hemoglobin	ชิ้นเนื้อจาก FFPE	-	400	650	650	จันทร์ - ศุกร์	-	3 วันทําการ \
                  06719	Beta hCG	ชิ้นเนื้อจาก FFPE	-	750	1,100	1,100	จันทร์ - ศุกร์	-	3 วันทําการ \
                  06720	IgA	ชิ้นเนื้อจาก FFPE	-	650	950	950	จันทร์ - ศุกร์	-	3 วันทําการ \
                  06721	IgG	ชิ้นเนื้อจาก FFPE	-	650	950	950	จันทร์ - ศุกร์	-	3 วันทําการ \
                  06722	IgM	ชิ้นเนื้อจาก FFPE	-	400	650	650	จันทร์ - ศุกร์	-	3 วันทําการ \
                  06723	Kappa	ชิ้นเนื้อจาก FFPE	-	500	800	800	จันทร์ - ศุกร์	-	3 วันทําการ \
                  06724	Lambda	ชิ้นเนื้อจาก FFPE	-	500	800	800	จันทร์ - ศุกร์	-	3 วันทําการ \
                  06725	Laminin	ชิ้นเนื้อจาก FFPE	-	600	900	900	จันทร์ - ศุกร์	-	3 วันทําการ \
                  06726	Melanoma (HMB-45)	ชิ้นเนื้อจาก FFPE	-	850	1,200	1,200	จันทร์ - ศุกร์	-	3 วันทําการ \
                  06727	Myeloperoxidase	ชิ้นเนื้อจาก FFPE	-	400	650	650	จันทร์ - ศุกร์	-	3 วันทําการ \
                  06728	MyoD1	ชิ้นเนื้อจาก FFPE	-	600	900	900	จันทร์ - ศุกร์	-	3 วันทําการ \
                  06729	Myogenin	ชิ้นเนื้อจาก FFPE	-	650	950	950	จันทร์ - ศุกร์	-	3 วันทําการ \
                  06730	Myoglobin	ชิ้นเนื้อจาก FFPE	-	400	650	650	จันทร์ - ศุกร์	-	3 วันทําการ \
                  06731	Muscle Actin	ชิ้นเนื้อจาก FFPE	-	500	800	800	จันทร์ - ศุกร์	-	3 วันทําการ \
                  06732	NSE	ชิ้นเนื้อจาก FFPE	-	750	1,100	1,100	จันทร์ - ศุกร์	-	3 วันทําการ \
                  06734	P63	ชิ้นเนื้อจาก FFPE	-	450	750	750	จันทร์ - ศุกร์	-	3 วันทําการ \
                  06737	PLAP	ชิ้นเนื้อจาก FFPE	-	550	850	850	จันทร์ - ศุกร์	-	3 วันทําการ \
                  06739	Prolactin	ชิ้นเนื้อจาก FFPE	-	450	750	750	จันทร์ - ศุกร์	-	3 วันทําการ \
                  06740	PSAP	ชิ้นเนื้อจาก FFPE	-	400	400	650	จันทร์ - ศุกร์	-	3 วันทําการ \
                  06741	PSA	ชิ้นเนื้อจาก FFPE	-	700	1,000	1,000	จันทร์ - ศุกร์	-	3 วันทําการ \
                  06742	Synaptophysin	ชิ้นเนื้อจาก FFPE	-	750	1,100	1,100	จันทร์ - ศุกร์	-	3 วันทําการ \
                  06743	S-100	ชิ้นเนื้อจาก FFPE	-	400	650	650	จันทร์ - ศุกร์	-	3 วันทําการ \
                  06744	TdT	ชิ้นเนื้อจาก FFPE	-	850	1,200	1,200	จันทร์ - ศุกร์	-	3 วันทําการ \
                  06745	Thyroglobulin	ชิ้นเนื้อจาก FFPE	-	400	650	650	จันทร์ - ศุกร์	-	3 วันทําการ \
                  06746	TTF-1	ชิ้นเนื้อจาก FFPE	-	500	500	800	จนั ทร์ - ศุกร์	-	3 วันทําการ \
                  06747	Vimentin	ชิ้นเนื้อจาก FFPE	-	600	900	900	จันทร์ - ศุกร์	-	3 วันทําการ \
                  06748	Cytokeratin 5	ชิ้นเนื้อจาก FFPE	-	500	800	800	จันทร์ - ศุกร์	-	3 วันทําการ \
                  06749	Cytokeratin 14	ชิ้นเนื้อจาก FFPE	-	550	850	850	จันทร์ - ศุกร์	-	3 วันทําการ \
                  06750	CD 56	ชิ้นเนื้อจาก FFPE	-	550	850	850	จันทร์ - ศุกร์	-	3 วันทําการ \
                  06751	Granzyme B	ชิ้นเนื้อจาก FFPE	-	600	900	900	จันทร์ - ศุกร์	-	3 วันทําการ \
                  06754	MUM1	ชิ้นเนื้อจาก FFPE	-	450	750	750	จันทร์ - ศุกร์	-	3 วันทําการ \
                  06755	ACTH	ชิ้นเนื้อจาก FFPE	-	550	850	850	จันทร์ - ศุกร์	-	3 วันทําการ \
                  06756	BCL6	ชิ้นเนื้อจาก FFPE	-	500	800	800	จันทร์ - ศุกร์	-	3 วันทําการ \
                  06757	Hepatocyte	ชิ้นเนื้อจาก FFPE	-	400	650	650	จันทร์ - ศุกร์	-	3 วันทําการ \
                  06758	CDX2	ชิ้นเนื้อจาก FFPE	-	750	1,100	1,100	จันทร์ - ศุกร์	-	3 วันทําการ \
                  09032	P504s	ชิ้นเนื้อจาก FFPE	-	700	1,000	1,000	จันทร์ - ศุกร์	-	3 วันทําการ \
                  09033	Cytokeratin 19	ชิ้นเนื้อจาก FFPE	-	400	650	650	จันทร์ - ศุกร์	-	3 วันทําการ \
                  09134	CD4	ชิ้นเนื้อจาก FFPE	-	850	1,200	1,200	จันทร์ - ศุกร์	-	3 วันทําการ \
                  09135	CD8	ชิ้นเนื้อจาก FFPE	-	500	500	800	จันทร์ - ศุกร์	-	3 วันทําการ \
                  09205	Beta-F1	ชิ้นเนื้อจาก FFPE	-	500	800	800	จันทร์ - ศุกร์	-	3 วันทําการ \
                  09208	Lana-1(HHV8)	ชิ้นเนื้อจาก FFPE	-	800	1,150	1,150	จันทร์ - ศุกร์	-	3 วันทําการ \
                  09209	PAX-5	ชิ้นเนื้อจาก FFPE	-	650	950	950	จันทร์ - ศุกร์	-	3 วันทําการ \
                  09210	Pythium	ชิ้นเนื้อจาก FFPE	-	450	750	750	จันทร์ - ศุกร์	-	3 วันทําการ \
                  09217	Annexin A1	ชิ้นเนื้อจาก FFPE	-	750	1,100	1,100	จันทร์ - ศุกร์	-	3 วันทําการ \
                  09219	EGFR	ชิ้นเนื้อจาก FFPE	-	460	750	750	จันทร์ - ศุกร์	-	3 วันทําการ \
                  09220	SV40	ชิ้นเนื้อจาก FFPE	-	500	800	800	จันทร์ - ศุกร์	-	3 วันทําการ \
                  09222	WT1	ชิ้นเนื้อจาก FFPE	-	850	1,200	1,200	จันทร์ - ศุกร์	-	3 วันทําการ \
                  15928	CMV	ชิ้นเนื้อจาก FFPE	-	650	950	950	จันทร์ - ศุกร์	-	3 วันทําการ \
                  11693	BOB1	ชิ้นเนื้อจาก FFPE	-	540	850	850	จันทร์ - ศุกร์	-	3 วันทําการ \
                  11694	CD2	ชิ้นเนื้อจาก FFPE	-	800	1,100	1,100	จันทร์ - ศุกร์	-	3 วันทําการ \
                  11695	CD19	ชิ้นเนื้อจาก FFPE	-	700	1,000	1,000	จันทร์ - ศุกร์	-	3 วันทําการ \
                  11696	c-MYC	ชิ้นเนื้อจาก FFPE	-	700	1,000	1,000	จันทร์ - ศุกร์	-	3 วันทําการ \
                  11697	DOG-1	ชิ้นเนื้อจาก FFPE	-	1,100	1,500	1,500	จันทร์ - ศุกร์	-	3 วันทําการ \
                  11698	FLI-1	ชิ้นเนื้อจาก FFPE	-	600	900	900	จันทร์ - ศุกร์	-	3 วันทําการ \
                  11700	Glycoporin A	ชิ้นเนื้อจาก FFPE	-	500	800	800	จันทร์ - ศุกร์	-	3 วันทําการ \
                  11701	MelanA	ชิ้นเนื้อจาก FFPE	-	450	700	700	จันทร์ - ศุกร์	-	3 วันทําการ \
                  11702	Napsin A	ชิ้นเนื้อจาก FFPE	-	450	700	700	จันทร์ - ศุกร์	-	3 วันทําการ \
                  11703	Neu N	ชิ้นเนื้อจาก FFPE	-	500	800	800	จันทร์ - ศุกร์	-	3 วันทําการ \
                  11704	OCT2	ชิ้นเนื้อจาก FFPE	-	560	900	900	จันทร์ - ศุกร์	-	3 วันทําการ \
                  11705	PD-L1(22C3)	ชิ้นเนื้อจาก FFPE	-	3,300	4,000	4,000	จันทร์ - ศุกร์	-	5 วันทําการ \
                  11706	PD1	ชิ้นเนื้อจาก FFPE	-	550	850	850	จันทร์ - ศุกร์	-	3 วันทําการ \
                  11707	STAT6	ชิ้นเนื้อจาก FFPE	-	600	900	900	จันทร์ - ศุกร์	-	3 วันทําการ \
                  11708	CAM 5.2	ชิ้นเนื้อจาก FFPE	-	450	700	700	จันทร์ - ศุกร์	-	3 วันทําการ \
                  11709	IDH 1	ชิ้นเนื้อจาก FFPE	-	650	950	950	จันทร์ - ศุกร์	-	3 วันทําการ \
                  11710	anti-ERG	ชิ้นเนื้อจาก FFPE	-	750	1,100	1,100	จันทร์ - ศุกร์	-	3 วันทําการ \
                  11711	BRAF	ชิ้นเน้ือจาก FFPE	-	2,500	3,200	3,200	จันทร์ - ศุกร์	-	3 วันทําการ \
                  11712	GATA3	ชิ้นเนื้อจาก FFPE	-	750	1,100	1,100	จันทร์ - ศุกร์	-	3 วันทําการ \
                  11713	Neurofilament	ชิ้นเนื้อจาก FFPE	-	750	1,100	1,100	จันทร์ - ศุกร์	-	3 วันทําการ \
                  11714	OCT4	ชิ้นเนื้อจาก FFPE	-	750	1,100	1,100	จันทร์ - ศุกร์	-	3 วันทําการ \
                  11715	P16	ชิ้นเนื้อจาก FFPE	-	1,150	1,600	1,600	จันทร์ - ศุกร์	-	3 วันทําการ \
                  11716	SOX-11	ชิ้นเนื้อจาก FFPE	-	900	1,300	1,300	จันทร์ - ศุกร์	-	3 วันทําการ \
                  11717	CD71	ชิ้นเนื้อจาก FFPE	-	800	1,200	1,200	จันทร์ - ศุกร์	-	3 วันทําการ \
                  11718	anti-ATRX	ชิ้นเนื้อจาก FFPE	-	1,250	1,700	1,700	จันทร์ - ศุกร์	-	3 วันทําการ \
                  11719	D2-40	ชิ้นเนื้อจาก FFPE	-	750	1,100	1,100	จันทร์ - ศุกร์	-	3 วันทําการ \
                  11720	ROS-1	ชิ้นเนื้อจาก FFPE	-	1,700	2,200	2,200	จันทร์ - ศุกร์	-	3 วันทําการ \
                  11721	Beta-catenin	ชิ้นเนื้อจาก FFPE	-	800	1,200	1,200	จันทร์ - ศุกร์	-	3 วันทําการ \
                  09212	Alpha Inhibin	ชิ้นเนื้อจาก FFPE	-	400	500	500	จันทร์ - ศุกร์	-	3 วันทําการ \
                  15926	CD7	ชิ้นเนื้อจาก FFPE	-	550	650	650	จันทร์ - ศุกร์	-	3 วันทําการ \
                  11663	Galectin-3	ชนเน้ือจาก FFPE	-	700	1,000	1,000	จันทร์ - ศุกร์	-	3 วันทําการ \
                  15927	GCDFP-15	ชิ้นเนื้อจาก FFPE	-	550	650	650	จันทร์ - ศุกร์	-	3 วันทําการ \
                  11669	Glypican-3	ชิ้นเนื้อจาก FFPE	-	700	1,000	1,000	จันทร์ - ศุกร์	-	3 วันทําการ \
                  11664	HBME-1	ชิ้นเนื้อจาก FFPE	-	700	1,000	1,000	จันทร์ - ศุกร์	-	3 วันทําการ \
                  11633	IgG4	ชิ้นเนื้อจาก FFPE	-	800	1,200	1,200	จันทร์ - ศุกร์	-	3 วันทําการ \
                  11667	INI-1	ชิ้นเนื้อจาก FFPE	-	690	1,000	1,000	จันทร์ - ศุกร์	-	3 วันทําการ \
                  11668	MOC-31 Epithelial Related Antigen	ชิ้นเนื้อจาก FFPE	-	650	950	950	จันทร์ - ศุกร์	-	3 วันทําการ \
                  11670	P40	ชิ้นเนื้อจาก FFPE	-	600	900	900	จันทร์ - ศุกร์	-	3 วันทําการ \
                  11632	PAX-8	ชิ้นเนื้อจาก FFPE	-	900	1,300	1,300	จันทร์ - ศุกร์	-	3 วันทําการ \
                  11634	RCC	ชิ้นเนื้อจาก FFPE	-	800	1,200	1,200	จันทร์ - ศุกร์	-	3 วันทําการ \
                  11635	Smooth muscle myosin heavy chain (SM-MHC)	ชิ้นเนื้อจาก FFPE	-	650	950	950	จันทร์ - ศุกร์	-	3 วันทําการ \
                  11631	ALK (D5F3)	ชิ้นเนื้อจาก FFPE	-	1,700	2,200	2,200	จันทร์ - ศุกร์	-	3 วันทําการ \
                  11637	Immunostudy for HNPCC	ชิ้นเนื้อจาก FFPE	-	2,400	3,500	3,500	จันทร์ - ศุกร์	-	3 วันทําการ \
                  11726	PD-L1(SP142)	ชิ้นเนื้อจาก FFPE	-	2,700	3,600	3,600	จันทร์ - ศุกร์	-	3 วันทําการ \
                  11727	PD-L1(SP263)	ชิ้นเนื้อจาก FFPE	-	2,700	3,600	3,600	จันทร์ - ศุกร์	-	3 วันทําการ \
                  06661	Estrogen receptor	ชิ้นเนื้อจาก FFPE	-	570	800	800	จันทร์ - ศุกร์	-	3 วันทําการ \
                  06662	Progesterone receptor	ชิ้นเนื้อจาก FFPE	-	570	800	800	จันทร์ - ศุกร์	-	3 วันทําการ \
                  06664	Her2/ neu	ชิ้นเนื้อจาก FFPE	-	740	1,000	1,000	จันทร์ - ศุกร์	-	3 วันทําการ \
                  06752	Ki-67	ชิ้นเนื้อจาก FFPE	-	390	610	610	จันทร์ - ศุกร์	-	3 วันทําการ \ "

                },
                {
                  "type": "text",
                  "text": "Details of the packages include \
                  รหัสบริการ ชื่อpackage ชื่อการทดสอบ ราคาทดสอบสามัญ	ราคาทดสอบคลินิกพิเศษ/คลินิกพรีเมี่ยม\
                  11950	Panel 6 Spindle cell sarcoma	Actin (smooth muscle) (Immunoperoxidase)                  CD 34 (Immunoperoxidase) \
                  Cytokeratin (AE1/AE3)                  Desmin (Immunoperoxidase)                  S-100 (Immunoperoxidase)\
                  STAT6 (Immunoperoxidase)\
                  anti -ERG (Immunoperoxidase)\
                  h - Caldesmon (Immunoperoxidase)\
                  SOX-10, Tissue\
                  TLE-1, Tissue	5,820	8,400\
                  11951	Panel 7 Round cell sarcoma	Cytokeratin (AE1/AE3) (Immunoperoxidase)\
                  CD 45 (LCA) (Immunoperoxidase)\
                  CD 99 (Immunoperoxidase)\
                  Desmin (Immunoperoxidase)\
                  Myo D1 (Immunoperoxidase)\
                  Myogenin (Immunoperoxidase)\
                  S-100 (Immunoperoxidase)\
                  WT 1\
                  Fli1 (Immunoperoxidase)\
                  anti -ERG (Immunoperoxidase)\
                  SOX-10, Tissue\
                  BCOR, Tissue\
                  ETV4, Tissue\
                  SATB2, Tissue\
                  DUX 4, Tissue	8,930	11,800\
                  11952	Panel 8 Mesothelioma vs carcinoma	Cytokeratin (AE1/AE3) (Immunoperoxidase)\
                  TTF-1 (Immunoperoxidase)\
                  Calretinin\
                  GATA3 (Immunoperoxidase)\
                  D2-40 (Immunoperoxidase)\
                  WT 1\
                  PAX8 วิธี IHC\
                  NapsinA (Immunoperoxidase)\
                  Cytokeratin7 (Immunoperoxidase)\
                  Cytokeratin20 (Immunoperoxidase)\
                  Cytokeratin5\
                  P40\
                  Epithelial Related Antigen (MOC-31)\
                  BER-EP4, Tissue\
                  BAP1, Tissue	9,250	12,200\                  11953	Panel 9 Metastatic Adenocarcinoma	Cytokeratin7 (Immunoperoxidase)\
                  Cytokeratin20 (Immunoperoxidase)\
                  TTF-1 (Immunoperoxidase)\
                  PSA (Immunoperoxidase)\
                  CDX2\
                  Cytokeratin19\
                  PAX8 วิธี IHC\
                  GATA3 (Immunoperoxidase)\
                  Mammaglobin, Tissue	5,580	8,100\	\
                  11954	Panel 10 Low grade giloma / high grade giloma	P53 (Immunoperoxidase)\
                  GFAP (Immunoperoxidase)\
                  Ki 67\
                  IDH 1 (Immunoperoxidase)\
                  P16 (Immunoperoxidase)\
                  anti-ATRX (Immunoperoxidase)\
                  Olig2, Tissue	4,840	6,600\		\
                  11955	Panel 11 Pituitary adenoma	Ki 67\
                  Prolactin (Immunoperoxidase)\
                  ACTH\
                  P53 (Immunoperoxidase)\
                  LH, Tissue\
                  GH, Tissue\
                  FSH, Tissue\
                  TSH, Tissue	3,690	5,300\		\
                  11956	Panel 12 CNS germ cell tumor	Cytokeratin (AE1/AE3) (Immunoperoxidase)\
                  CD 30 (Immunoperoxidase)\
                  alpha -1 fetoprotein (Immunoperoxidase)\
                  CD117 (Immunoperoxidase)\
                  Beta hCG (Immunoperoxidase)\
                  PLAP (Immunoperoxidase)\
                  Oct-4 (Immunoperoxidase)\
                  SALL4, Tissue	4,740	6,500 \
                  11957	Panel 13 Ovarian sex-cord and stromal neoplasm	EMA (Immunoperoxidase)\
                  Alpha Inhibin\
                  WT 1\
                  CD 99 (Immunoperoxidase)\
                  CD 56\
                  BRG-1, Tissue\
                  Calretinin	4,650	6,400\			\
                  11958	Panel 14 GYN Mesenchymal neoplasm	Actin (smooth muscle) (Immunoperoxidase)\
                  Desmin (Immunoperoxidase)\
                  CD117 (Immunoperoxidase)\
                  S-100 (Immunoperoxidase)\
                  Estrogen receptor\
                  Progesterone\
                  h - Caldesmon (Immunoperoxidase)\
                  CD 10 (Immunoperoxidase)\
                  Cyclin D1 (Immunoperoxidase)\
                  ALK (D5F3) วิธี IHC\
                  Smooth muscle myosin heavy chain (SMMHC)\
                  BCOR, Tissue\
                  Pan-TRK, Tissue	9,430	12,400\
                  11959	Panel 15 Endometrial CA with Ambiguous morphology	Cytokeratin7 (Immunoperoxidase)\
                  Cytokeratin20 (Immunoperoxidase)\
                  PAX8 วิธี IHC\
                  P53 (Immunoperoxidase)\
                  P16 (Immunoperoxidase)\
                  Estrogen receptor\
                  Progesterone\
                  WT 1\
                  Napsin A (Immunoperoxidase)\
                  Beta-catenin (Immunoperoxidase)	6,540	9,200\
                  11960	Panel 16 Ovarian germ cell neoplasm	CD 30 (Immunoperoxidase)\
                  CD117 (Immunoperoxidase)\
                  Beta hCG (Immunoperoxidase)\
                  PLAP (Immunoperoxidase)\
                  alpha -1 fetoprotein (Immunoperoxidase)\
                  Glypican-3\
                  Oct-4 (Immunoperoxidase)\
                  D2-40 (Immunoperoxidase)\
                  SALL4, Tissue	5,740	8,300\	\
                  11961	Panel 17 Acute leukemia	CD 34 (Immunoperoxidase)\
                  CD68 (Immunoperoxidase)\
                  CD3 (Immunoperoxidase)\
                  CD79a (Immunoperoxidase)\
                  CD117 (Immunoperoxidase)\
                  Myeloperoxidase (Immunoperoxidase)\
                  PAX - 5	3,760	5,400\
                  11962	Panel 18 Large cell NHL	CD 3 (Immunoperoxidase)\
                  CD20 (Immunoperoxidase)\
                  CD10 (Immunoperoxidase)\
                  Cyclin D1 (Immunoperoxidase)\
                  Ki 67\
                  CD30 (Immunoperoxidase)\
                  P53 (Immunoperoxidase)\
                  Bcl6\
                  MUM1\
                  Bcl2 (Immunoperoxidase)\
                  EPSTIEN BARR VIRUS (EBV) โดยวิธี IN SITU HYBRIDIZATION\
                  CD5 (Immunoperoxidase)\
                  c-MYC (Immunoperoxidase)	8,340	11,200\
                  11963	Panel 19 Small cell NHL	CD 3 (Immunoperoxidase)\
                  CD5 (Immunoperoxidase)\
                  CD10 (Immunoperoxidase)\
                  CD20 (Immunoperoxidase)\
                  CD23 (Immunoperoxidase)\
                  Bcl2 (Immunoperoxidase)\
                  CyclinD1 (Immunoperoxidase)\
                  Bcl6\
                  CD43 (Immunoperoxidase)\
                  Kappa (Immunoperoxidase)\
                  Lambda (Immunoperoxidase)\
                  Annexin A1\
                  SOX-11 (Immunoperoxidase)	7,140	9,800\
                  11964	Panel 20 Hodgkin lymphoma	CD 3 (Immunoperoxidase)\
                  CD15 (Immunoperoxidase)\
                  CD20 (Immunoperoxidase)\
                  CD30 (Immunoperoxidase)\
                  CD45 (LCA) (Immunoperoxidase)\
                  PAX5	3,100	4,700\
                  15914	Immunopackage for Breast Cancer	Estrogen receptor\
                  Progesterone receptor\
                  Her2/ neu\
                  Ki-67	2,000	3,500\
                  "
                }
              ]
            }
          ],
          temperature: 1,
          top_p: 1,
        });
    console.log(JSON.stringify(completion));
    return completion.choices[0].message.content;
}


const reply = async (replyToken, payload) => {
    await axios({
        method: "post",
        url: `${LINE_MESSAGING_API}/message/reply`,
        headers: LINE_HEADER,
        data: JSON.stringify({
            replyToken: replyToken,
            messages: [payload]
        })
    });
};

module.exports = { openaiTextRequest, reply };