import { TENKAN, CHISHI, KANSHI_60, getTsuhensei, getJuniunsei, findTenkan } from "./src/data/core";
import { NISSHU } from "./src/data/nisshu";
import { TSUHENSEI } from "./src/data/tsuhensei";
import { JUNIUNSEI, GOGYO_BALANCE, NENUN } from "./src/data/interpretation";

let ok = true;
const check = (cond: boolean, msg: string) => { if(!cond){console.log("✗ "+msg);ok=false;} };

// 確定データの件数
check(TENKAN.length===10, "天干10種");
check(CHISHI.length===12, "地支12種");
check(KANSHI_60.length===60, "60干支");
check(KANSHI_60[0]==="甲子" && KANSHI_60[59]==="癸亥", "60干支の始端終端");

// 鑑定文データの網羅性
check(Object.keys(NISSHU).length===10, "日主10種すべて");
check(Object.keys(TSUHENSEI).length===10, "通変星10種すべて");
check(Object.keys(JUNIUNSEI).length===12, "十二運星12種すべて");
check(Object.keys(GOGYO_BALANCE).length===5, "五行バランス5種");
check(Object.keys(NENUN).length===5, "年運5グループ");

// 全日主が全フィールドを持つか
for(const k of Object.keys(NISSHU)){
  const d = NISSHU[k];
  check(!!d.honshitsu && !!d.renai && !!d.shigoto && d.keywords.length>0, `日主${k}の全フィールド`);
}

// 計算と鑑定文の連結確認：日主甲から全天干の通変星を出し、データが引けるか
const ko = findTenkan("甲");
for(const t of TENKAN){
  const star = getTsuhensei(ko, t);
  check(!!TSUHENSEI[star], `通変星${star}の鑑定文が存在`);
}

// 全日主×全地支で十二運星が引けるか（120通り）
let juniCount = 0;
for(const n of TENKAN){
  for(let i=0;i<12;i++){
    const j = getJuniunsei(n.kanji, i);
    if(JUNIUNSEI[j]) juniCount++;
  }
}
check(juniCount===120, `全日主×地支の十二運星120通り (実際:${juniCount})`);

console.log(ok ? "\n✓ 全データ検証OK：欠損なし、計算と鑑定文が完全に連結" : "\n✗ 不備あり");
