/* Load the assistant only when a visitor opens it; keep the first page render light. */
(function(){
  var button=document.getElementById("vc-btn");
  if(!button)return;
  var loading=false,loaded=false;
  button.addEventListener("click",function(){
    if(loaded||loading)return;
    loading=true;
    var script=document.createElement("script");
    script.src="visa-chat.js";
    script.async=true;
    script.onload=function(){loading=false;loaded=true;button.click();};
    script.onerror=function(){loading=false;script.remove();};
    document.body.appendChild(script);
  });
})();
