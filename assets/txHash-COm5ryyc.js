function r(t){if(!t)return null;if(typeof t!="string")try{t=JSON.stringify(t)}catch{return null}const n=t.match(/0x[a-fA-F0-9]{64}/);return n?n[0]:null}export{r as e};
