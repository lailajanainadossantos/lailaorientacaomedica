function $(id){ return document.getElementById(id); }
function round(n,d){ var p=Math.pow(10,d||0); return Math.round(n*p)/p; }
function todayISO(){ return new Date().toISOString().slice(0,10); }

function dengueHydration(ageYears, weightKg){
  var child = ageYears < 12;
  var total = child ? 80*weightKg : Math.min(Math.max(2000, 35*weightKg), 3000);
  var hourly = total/24;
  return {
    totalMlDay: Math.round(total),
    hourlyMl: Math.round(hourly),
    orsLiters: round(total/1000,2),
    orsSachets: Math.ceil(total/1000)
  };
}
function gecaPlan(ageYears, weightKg){
  var child = ageYears < 12;
  return {
    perEpisode: child ? Math.round(10*weightKg) : "200–250",
    dailySupport: child ? Math.round(60*weightKg) : null
  };
}

function bullets(arr){ return "<ul>"+arr.map(function(x){return "<li>"+x+"</li>";}).join("")+"</ul>"; }
function section(title,html){ return '<div class="section"><h3>'+title+'</h3>'+html+'</div>'; }

var TEXTS = {
  dengue: function(age,kg){
    var h = dengueHydration(age,kg);
    return {
      title: "Dengue – Orientações ao paciente",
      what: "Doença viral transmitida pelo mosquito Aedes. A maioria melhora com suporte e hidratação; atenção maior entre o 3º e 7º dia.",
      how: [
        "Meta diária de líquidos: <b>"+h.totalMlDay+" mL</b> (~"+h.orsLiters+" L), em goles frequentes. Média por hora: <b>"+h.hourlyMl+" mL/h</b>.",
        "SRO estimada: <b>"+h.orsSachets+" sachê(s)/dia</b> (1 sachê → 1 L). Alternar com água, água de coco e chás claros.",
        "Se vomitar, pausar 5–10 min e reiniciar com volumes menores.",
        "Usar apenas remédios indicados pelo médico; evitar anti-inflamatórios por conta própria."
      ],
      alarm: [
        "Vômitos persistentes, dor abdominal intensa ou piora súbita.",
        "Sangramentos, tontura/desmaio, urina reduzida, extremidades frias.",
        "Confusão, sonolência, sensação de desmaio."
      ],
      kpis: [
        ["Alvo diário", h.totalMlDay+" mL/dia"],
        ["Média por hora", h.hourlyMl+" mL/h"],
        ["SRO estimada", h.orsLiters+" L/dia"],
        ["Sachês", h.orsSachets+" un."]
      ]
    };
  },
  geca: function(age,kg){
    var p = gecaPlan(age,kg), child = age < 12;
    return {
      title: "Gastroenterite aguda – Orientações",
      what: "Infecção intestinal com diarreia e/ou vômitos, geralmente autolimitada.",
      how: [
        child ? "Ofereça SRO <b>"+p.perEpisode+" mL</b> após cada evacuação/vômito; alvo diário de suporte ~ <b>"+p.dailySupport+" mL</b> (ajustar por sede/diurese)."
              : "Após perdas, ingerir SRO <b>"+p.perEpisode+" mL</b>; fracionar em goles. Hidratar-se ao longo do dia.",
        "Dieta leve (arroz, banana, maçã cozida, caldos).",
        "Evitar bebidas alcoólicas, cafeína e refrigerantes no pico dos sintomas."
      ],
      alarm: [
        "Sinais de desidratação (boca seca, pouca urina, sonolência).",
        "Sangue nas fezes, febre alta persistente, vômitos incoercíveis.",
        "Piora em 24–48 h ou incapacidade de manter hidratação."
      ]
    };
  },
  ivas: function(){ return {
    title: "IVAS / Gripe – Orientações",
    what: "Infecção viral de vias aéreas superiores com tosse, coriza e dor de garganta.",
    how: [
      "Hidratação, repouso, lavagem nasal com soro.",
      "Ambiente arejado; controle de dor/febre conforme orientação.",
      "Antibiótico não ajuda em viroses comuns."
    ],
    alarm: [
      "Falta de ar, febre >72 h, dor torácica.",
      "Dor facial intensa, secreção purulenta persistente.",
      "Mal-estar que não melhora."
    ]};},
  sinusite: function(){ return {
    title: "Sinusite aguda – Orientações",
    what: "Inflamação dos seios da face com dor/pressão facial e congestão.",
    how: [
      "Lavagem nasal 2–3x/dia; hidratação e repouso relativo.",
      "Compressas mornas sobre o rosto; ambiente umidificado."
    ],
    alarm: ["Febre persistente, dor intensa, inchaço ao redor dos olhos, visão turva."]};},
  rinite: function(){ return {
    title: "Rinite alérgica – Orientações",
    what: "Inflamação alérgica do nariz por ácaros, poeira, pelos, mofo ou pólen.",
    how: [
      "Ambiente limpo e arejado, reduzir poeira, retirar tapetes/bichos de pelúcia.",
      "Lavagem nasal diária com soro fisiológico."
    ],
    alarm: ["Falta de ar, chiado no peito, febre ou secreção purulenta persistente."]};},
  asma: function(){ return {
    title: "Crise de asma – Orientações",
    what: "Aperto no peito, chiado e falta de ar por estreitamento das vias aéreas.",
    how: [
      "Usar inalador de resgate conforme prescrição (preferir espaçador).",
      "Evitar fumaça, poeira, mofo e cheiros fortes; manter hidratação."
    ],
    alarm: ["Fala entrecortada, cianose, uso de musculatura acessória, piora apesar do inalador."]};},
  drge: function(){ return {
    title: "DRGE – Refluxo: como cuidar",
    what: "Retorno de ácido do estômago ao esôfago, causando queimação/azia.",
    how: [
      "Refeições pequenas; não deitar por 2–3 h após comer.",
      "Reduzir café, álcool, refrigerantes, chocolate, frituras.",
      "Elevar cabeceira 10–15 cm; perda de peso se necessário."
    ],
    alarm: ["Dor torácica forte, vômitos com sangue, fezes negras, disfagia progressiva."]};},
  constipacao: function(){ return {
    title: "Constipação – Como melhorar",
    what: "Fezes endurecidas e evacuações difíceis ou infrequentes.",
    how: [
      "Beber água regularmente; aumentar fibras (frutas, vegetais, aveia).",
      "Rotina diária para evacuar; atividade física.",
      "Laxantes apenas com orientação."
    ],
    alarm: ["Dor intensa, distensão, vômitos persistentes, sangramento volumoso."]};},
  hipertensao: function(){ return {
    title: "Pressão alta (sem emergência) – Orientações",
    what: "Elevação pressórica sem sinais de gravidade imediata.",
    how: [
      "Repouso, rechecagem da pressão, adesão ao tratamento.",
      "Reduzir sal; evitar AINEs e descongestionantes; revisar medicações."
    ],
    alarm: ["Dor no peito, falta de ar, déficit neurológico, confusão, PA muito alta com sintomas."]};},
  cefaleia: function(){ return {
    title: "Cefaleia / Enxaqueca – Orientações",
    what: "Dor de cabeça geralmente benigna, por vezes com náusea, foto/fonofobia.",
    how: [
      "Analgésicos seguros, repouso; evitar gatilhos (jejum, álcool, falta de sono).",
      "Ambiente silencioso/escuro; hidratação."
    ],
    alarm: ["Cefaleia súbita em trovoada, febre com rigidez de nuca, déficit neurológico, trauma recente."]};},
  hemorroidas: function(){ return {
    title: "Hemorroidas – Como cuidar",
    what: "Veias inchadas no reto/ânus com dor, coceira ou sangramento leve.",
    how: [
      "Banho de assento morno 10–15 min, várias vezes ao dia.",
      "Mais fibras e água; evitar esforço para evacuar.",
      "Higiene suave; evitar papel áspero e perfumes na região."
    ],
    alarm: ["Sangramento abundante, dor intensa, secreção purulenta, febre."]};},
  epistaxe: function(){ return {
    title: "Sangramento nasal – O que fazer",
    what: "Sangramento da mucosa nasal, geralmente benigno.",
    how: [
      "Sentar e inclinar a cabeça levemente para frente; comprimir a narina 10 min.",
      "Compressa fria no dorso do nariz; evitar banhos/alimentos muito quentes."
    ],
    alarm: ["Sangramento que não cessa em 20 min, tontura, palidez, uso de anticoagulantes com sangramento."]};},
  entorse: function(){ return {
    title: "Entorse – Cuidados iniciais",
    what: "Lesão de ligamentos por torção.",
    how: [
      "Repouso relativo; gelo 15–20 min a cada 2–3 h por 48 h.",
      "Compressão elástica sem apertar; elevação do membro."
    ],
    alarm: ["Dor/inchaço intensos, incapacidade de apoiar, formigamento/dormência, mudança de cor."]};},
  abscesso: function(){ return {
    title: "Abscesso cutâneo – Cuidados",
    what: "Coleção de pus na pele por infecção local.",
    how: [
      "Higiene diária com água e sabão; compressas mornas 15–20 min, 3–4x/dia.",
      "Não espremer; não manipular; manter unhas curtas."
    ],
    alarm: ["Febre alta, listras vermelhas, dor intensa, secreção fétida, progressão rápida."]};},
  otite: function(){ return {
    title: "Otite média aguda – Orientações",
    what: "Inflamação do ouvido médio com dor e febre.",
    how: [
      "Controle da dor; manter ouvido seco; não usar cotonete.",
      "Dormir com a cabeça levemente elevada."
    ],
    alarm: ["Febre alta persistente, secreção purulenta, perda auditiva súbita, tontura importante."]};},
  pneumonia: function(){ return {
    title: "Pneumonia leve – Orientações",
    what: "Infecção pulmonar; em casos leves, manejo domiciliar é possível.",
    how: [
      "Repouso, hidratação, ambiente arejado; controle de febre/dor conforme orientação.",
      "Retomar atividades apenas após melhora consistente."
    ],
    alarm: ["Febre >72 h, falta de ar progressiva, dor torácica intensa, confusão, cianose."]};},
  lavagem_nasal: function(){ return {
    title: "Lavagem nasal — Passo a passo",
    what: "Irrigação com soro fisiológico para fluidificar secreções e aliviar a congestão.",
    how: [
      "Usar soro 0,9% em temperatura ambiente.",
      "Inclinar levemente a cabeça e aplicar com seringa/irrigador.",
      "Adultos: 10–20 mL por narina, 2–4x/dia; Crianças: 5–10 mL por narina, 2–4x/dia.",
      "Higienizar o dispositivo após cada uso."
    ],
    alarm: ["Dor de ouvido importante, sangramento nasal frequente, dor/pressão facial que piora com febre."]};},
  dor_abdominal: function(){ return {
    title: "Dor abdominal leve — Orientações",
    what: "Dor de barriga sem sinais de gravidade na avaliação inicial.",
    how: [
      "Hidratação e alimentação leve; evitar gorduras e excesso de café/álcool.",
      "Evitar anti-inflamatórios por conta própria; preferir analgésicos simples quando orientado.",
      "Observar localização, intensidade, fatores que pioram/melhoram."
    ],
    alarm: ["Dor progressiva forte, vômitos persistentes, febre alta, pele/olhos amarelados, sangue nas fezes."]};},
  queimaduras: function(){ return {
    title: "Queimaduras leves — Cuidados iniciais",
    what: "Lesões superficiais por calor, sol ou contato breve.",
    how: [
      "Resfriar com água corrente por 10–20 minutos (não usar gelo direto).",
      "Manter a área limpa e coberta com curativo seco quando indicado; não estourar bolhas.",
      "Evitar pomadas caseiras, pasta de dente, manteiga/óleo."
    ],
    alarm: ["Área extensa, rosto/mãos/genitais, dor desproporcional, sinais de infecção (pus, odor), febre."]};},
  ansiedade_sono: function(){ return {
    title: "Ansiedade leve • Higiene do sono",
    what: "Sintomas de preocupação/ansiedade podem piorar o sono; rotinas ajudam a regular.",
    how: [
      "Manter horários regulares para deitar e acordar; evitar telas 1–2 h antes de dormir.",
      "Ambiente silencioso, escuro e fresco; evitar cafeína/álcool à noite.",
      "Técnicas de respiração/relaxamento; registrar pensamentos e planejar o dia seguinte.",
      "Atividade física regular durante o dia."
    ],
    alarm: ["Ideação suicida, crises de pânico intensas, incapacidade funcional importante, uso abusivo de álcool/drogas."]};},
  bronquiolite: function(){ return {
    title: "Bronquiolite (bebês/crianças pequenas) — Orientações",
    what: "Infecção viral dos bronquíolos com tosse, chiado e respiração mais rápida.",
    how: [
      "Oferecer líquidos com frequência; fracionar as mamadas/alimentação.",
      "Manter o nariz limpo com soro fisiológico.",
      "Evitar fumaça de cigarro e ambientes fechados."
    ],
    alarm: ["Respiração muito rápida, costelas marcando, gemido, lábios arroxeados, recusa persistente de líquidos, sonolência excessiva."]};},
  mao_pe_boca: function(){ return {
    title: "Doença mão‑pé‑boca — Orientações",
    what: "Virose com bolhinhas na boca, mãos e pés; costuma ser autolimitada.",
    how: [
      "Oferecer líquidos e alimentos frios/macios para aliviar dor na boca.",
      "Manter higiene das mãos, evitar compartilhar utensílios, limpar superfícies.",
      "Controle da dor/temperatura conforme orientação."
    ],
    alarm: ["Desidratação (pouca urina, boca seca), sonolência excessiva, vômitos persistentes, febre que não melhora."]};},
  dermatite_atopica: function(){ return {
    title: "Dermatite atópica — Cuidados diários",
    what: "Inflamação crônica da pele com coceira e ressecamento.",
    how: [
      "Banhos rápidos com água morna; usar sabonete suave apenas nas áreas necessárias.",
      "Hidratar a pele logo após o banho com creme/loção sem perfume.",
      "Roupas de algodão; evitar lã e calor excessivo; unhas curtas."
    ],
    alarm: ["Feridas com secreção/odor, febre, vermelhidão intensa e dolorosa, falha do tratamento habitual."]};},
  varicela: function(){ return {
    title: "Varicela (catapora) — Orientações",
    what: "Infecção viral com bolhinhas pelo corpo; coça e costuma melhorar em 1–2 semanas.",
    how: [
      "Manter unhas curtas; banhos mornos; hidratar a pele; evitar coçar.",
      "Isolamento domiciliar até todas as lesões estarem em crosta.",
      "Hidratação e controle de febre/dor quando necessário (evitar AAS)."
    ],
    alarm: ["Dificuldade para respirar, vômitos persistentes, sonolência excessiva, lesões com pus, febre alta que não melhora."]};},
  sarampo: function(){ return {
    title: "Sarampo — Orientações e prevenção",
    what: "Virose altamente contagiosa com febre, tosse, conjuntivite e manchas pelo corpo.",
    how: [
      "Hidratar-se, repousar, ambientes ventilados; higiene das mãos.",
      "Verificar situação vacinal das pessoas da casa (tríplice viral).",
      "Usar máscara se houver tosse intensa e orientação de isolamento."
    ],
    alarm: ["Falta de ar, sonolência/confusão, desidratação, febre alta persistente, convulsões."]};}
};

function buildContent(data){
  return section("O que é", "<p>"+data.what+"</p>")
       + section("Orientações", bullets(data.how))
       + section("Sinais de alarme – procurar serviço", bullets(data.alarm));
}
function render(){
  var age = parseFloat(($("age").value||"0")); if(isNaN(age)) age=0;
  var kg  = parseFloat(($("weight").value||"0")); if(isNaN(kg)) kg=0;
  var key = (($("keyword").value||"").trim().toLowerCase());
  var sel = $("disease") ? $("disease").value : "dengue";

  var map = {
    "dengue":"dengue","geca":"geca","gastro":"geca","gastroenterite":"geca",
    "gripe":"ivas","ivas":"ivas","resfriado":"ivas",
    "sinusite":"sinusite","rinite":"rinite","asma":"asma",
    "drge":"drge","refluxo":"drge","constipacao":"constipacao",
    "hipertensao":"hipertensao","pa":"hipertensao",
    "cefaleia":"cefaleia","enxaqueca":"cefaleia",
    "hemorroidas":"hemorroidas","hemorroide":"hemorroidas",
    "epistaxe":"epistaxe","sangramento nasal":"epistaxe",
    "entorse":"entorse","abscesso":"abscesso",
    "otite":"otite","pneumonia":"pneumonia",
    "lavagem nasal":"lavagem_nasal","lavagem":"lavagem_nasal",
    "dor abdominal":"dor_abdominal","queimaduras":"queimaduras","queimadura":"queimaduras",
    "ansiedade":"ansiedade_sono","sono":"ansiedade_sono",
    "bronquiolite":"bronquiolite","mao pe boca":"mao_pe_boca","mão‑pé‑boca":"mao_pe_boca","mao-pé-boca":"mao_pe_boca","maopéboca":"mao_pe_boca",
    "dermatite atopica":"dermatite_atopica","dermatite atópica":"dermatite_atopica",
    "varicela":"varicela","catapora":"varicela","sarampo":"sarampo"
  };
  var keyChoice = map[key] || sel;
  var builder = TEXTS[keyChoice] || TEXTS["dengue"];
  var data = builder(age,kg);

  $("title").textContent = data.title;
  $("leaflet").innerHTML = buildContent(data);

  var kpis = data.kpis||[];
  $("kpis").innerHTML = kpis.map(function(x){
    return '<div class="kpi"><div class="l">'+x[0]+'</div><div class="v">'+x[1]+'</div></div>';
  }).join("");

  var d = $("date"); if(d) d.value = todayISO();
  var meta = 'Paciente: <b>'+(($("patient").value)||"____________________")+'</b> • Data: <b>'+todayISO()+'</b>';
  $("p_title").textContent = data.title;
  $("p_meta").innerHTML = meta;

  var cols = [];
  cols.push('<div class="print-section"><h3>O que é</h3><div>'+data.what+'</div></div>');
  cols.push('<div class="print-section"><h3>Orientações</h3>'+bullets(data.how)+'</div>');
  cols.push('<div class="print-section"><h3>Sinais de alarme – procurar serviço</h3>'+bullets(data.alarm)+'</div>');
  $("p_cols").innerHTML = cols.join("");

  $("p_kpis").innerHTML = (kpis||[]).map(function(x){
    return '<div class="print-kpi"><div class="l">'+x[0]+'</div><div class="v">'+x[1]+'</div></div>';
  }).join("");
}

function attach(){
  ["patient","age","weight","keyword","disease"].forEach(function(id){
    var el = $(id); if(!el) return;
    el.addEventListener("input", render);
    el.addEventListener("change", render);
  });
}

document.addEventListener("DOMContentLoaded", function(){
  try{
    if ($("disease") && $("disease").selectedIndex < 0) $("disease").selectedIndex = 0;
    var dt=$("date"); if(dt) dt.value=todayISO();
    render(); attach();
  }catch(e){
    console.error(e);
  }
});
