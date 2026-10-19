// Shared, accessible subject navigation. Each subject keeps its own progress storage.
function mountSubjectNavigation(subject){
 const header=document.querySelector('.topbar');if(!header||header.querySelector('.subject-switch'))return;
 const isMath=subject==='math',nav=document.createElement('nav');nav.className='subject-switch';nav.setAttribute('aria-label','Выбор предмета');
 nav.innerHTML=`<span class="subject-switch-caption">RANTEACH · МОИ ПРЕДМЕТЫ</span><div class="subject-switch-options"><a href="${isMath?'index.html':'math/index.html'}" class="subject-option subject-math ${isMath?'is-current':''}" ${isMath?'aria-current="page"':''}><span class="subject-symbol" aria-hidden="true">π</span><span>Математика</span>${isMath?'<span class="subject-active-dot" aria-hidden="true"></span>':''}</a><a href="${isMath?'../index.html':'index.html'}" class="subject-option subject-physics ${!isMath?'is-current':''}" ${!isMath?'aria-current="page"':''}><span class="subject-symbol" aria-hidden="true">φ</span><span>Физика</span>${!isMath?'<span class="subject-active-dot" aria-hidden="true"></span>':''}</a></div>`;
 nav.querySelector('[aria-current="page"]').addEventListener('click',event=>event.preventDefault());
 header.prepend(nav);
}
if(typeof renderMath==='function'){
 const beforeSubjectRenderMath=renderMath;
 renderMath=function(){beforeSubjectRenderMath();mountSubjectNavigation('math');};
 mountSubjectNavigation('math');
}else if(typeof render==='function'){
 const beforeSubjectRenderPhysics=render;
 render=function(){beforeSubjectRenderPhysics();mountSubjectNavigation('physics');};
 mountSubjectNavigation('physics');
}
