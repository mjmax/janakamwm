const menu = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navigation');
const closeMenu = () => {menu.setAttribute('aria-expanded','false'); navigation.classList.remove('open');};
menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));navigation.classList.toggle('open',open);});
navigation.addEventListener('click',e=>{if(e.target.closest('a')) closeMenu();});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&menu.getAttribute('aria-expanded')==='true'){closeMenu();menu.focus();}});
const viewer=document.querySelector('#image-viewer');
const viewerImage=document.querySelector('#viewer-image');
let images=[], current=0;
const showImage=()=>{const button=images[current];const img=button.querySelector('img');viewerImage.src=img.src;viewerImage.alt=img.alt;document.querySelector('#viewer-caption').textContent=button.dataset.caption||img.alt;document.querySelector('#viewer-count').textContent=`${current+1} / ${images.length}`;};
document.addEventListener('click',e=>{const button=e.target.closest('.zoom-image');if(!button)return;const scope=button.closest('.source-gallery, .case-media, .product-grid, .research-modules')||button.parentElement;images=Array.from(scope.querySelectorAll('.zoom-image'));current=images.indexOf(button);showImage();viewer.showModal();document.body.style.overflow='hidden';});
viewer.querySelector('.viewer-close').addEventListener('click',()=>viewer.close());
viewer.addEventListener('close',()=>{document.body.style.overflow='';});
document.querySelector('#viewer-prev').addEventListener('click',()=>{current=(current-1+images.length)%images.length;showImage();});
document.querySelector('#viewer-next').addEventListener('click',()=>{current=(current+1)%images.length;showImage();});
viewer.addEventListener('keydown',e=>{if(e.key==='ArrowLeft'){e.preventDefault();document.querySelector('#viewer-prev').click();}if(e.key==='ArrowRight'){e.preventDefault();document.querySelector('#viewer-next').click();}});
if('IntersectionObserver' in window){const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){navigation.querySelectorAll('a').forEach(link=>{if(link.hash===`#${entry.target.id}`)link.setAttribute('aria-current','location');else link.removeAttribute('aria-current');});}});},{rootMargin:'-15% 0px -65% 0px'});document.querySelectorAll('main > section[id]').forEach(s=>observer.observe(s));}
document.querySelector('#year').textContent=new Date().getFullYear();
