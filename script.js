const songs = [
  { title:"Song 1", file:"Arz Kiya Hai-(SambalpuriStar.In).mp3", cover:"Arz Kiya Hai.jpg" },
  { title:"Song 2", file:"Alag Aasmaan-(SambalpuriStar.In).mp3", cover:"alag aasma.jpg" },
  { title:"Song 3", file:"Afsos (PenduJatt.Com.Se).mp3", cover:"afsos.jpg" },
  { title:"Song 4", file:"Dekho Na Dekho Na Zulfon Se-(SambalpuriStar.In).mp3", cover:"jo tum.jpg" },
  { title:"Song 5", file:"Husn-(SambalpuriStar.In).mp3", cover:"husn.jpg" }
];
let currentSongIndex=0, isShuffle=false, isRepeat=false;

const audio=document.getElementById("audio");
const title=document.getElementById("title");
const cover=document.getElementById("cover");
const miniCover=document.getElementById("mini-cover");
const miniTitle=document.getElementById("mini-title");
const miniTime=document.getElementById("mini-time");
const miniPlay=document.getElementById("mini-play");
const miniPrev=document.getElementById("mini-prev");
const miniNext=document.getElementById("mini-next");
const muteBtn=document.getElementById("mute");
const miniProgress=document.getElementById("mini-progress");
const volume=document.getElementById("volume");
const searchInput=document.getElementById("search");
const songList=document.getElementById("song-list");

// Load song
function loadSong(index){
  const song=songs[index];
  fadeOut(cover); fadeOut(title);
  setTimeout(()=>{
    title.textContent=miniTitle.textContent=song.title;
    cover.src=miniCover.src=song.cover;
    audio.src=song.file;
    fadeIn(cover); fadeIn(title);
  },300);
  audio.addEventListener('loadedmetadata',()=>{
    miniTime.textContent=`0:00 / ${formatTime(audio.duration)}`;
  });
}

// Fade animations
function fadeOut(el){ el.style.opacity=0; }
function fadeIn(el){ el.style.opacity=1; }

// Format time
function formatTime(time){ const m=Math.floor(time/60), s=Math.floor(time%60).toString().padStart(2,'0'); return `${m}:${s}`; }

// Play/Pause
miniPlay.addEventListener("click",()=>{
  if(audio.paused){ audio.play(); miniPlay.textContent="⏸️"; cover.classList.add("playing"); }
  else{ audio.pause(); miniPlay.textContent="▶️"; cover.classList.remove("playing"); }
});

// Next/Prev
function nextSong(){ currentSongIndex=(currentSongIndex+1)%songs.length; loadSong(currentSongIndex); audio.play(); miniPlay.textContent="⏸️"; cover.classList.add("playing"); }
function prevSong(){ currentSongIndex=(currentSongIndex-1+songs.length)%songs.length; loadSong(currentSongIndex); audio.play(); miniPlay.textContent="⏸️"; cover.classList.add("playing"); }
miniNext.addEventListener("click",nextSong);
miniPrev.addEventListener("click",prevSong);

// Mute/Volume
muteBtn.addEventListener("click",()=>{ audio.muted=!audio.muted; muteBtn.textContent=audio.muted?"🔇":"🔊"; });
volume.addEventListener("input",()=>{ audio.volume=volume.value/100; });

// Progress
audio.addEventListener("timeupdate",()=>{
  miniProgress.value=(audio.currentTime/audio.duration)*100||0;
  miniTime.textContent=`${formatTime(audio.currentTime)} / ${formatTime(audio.duration)}`;
});
miniProgress.addEventListener("input",()=>{ audio.currentTime=(miniProgress.value/100)*audio.duration; });

// Draggable Playlist
let draggedItem=null;
function loadPlaylist(filter=""){
  songList.innerHTML="";
  songs.filter(s=>s.title.toLowerCase().includes(filter.toLowerCase()))
       .forEach((song,index)=>{
         const li=document.createElement("li");
         li.setAttribute("draggable",true);
         const img=document.createElement("img"); img.src=song.cover;
         const span=document.createElement("span"); span.textContent=song.title;
         li.appendChild(img); li.appendChild(span);

         li.addEventListener("click",()=>{ currentSongIndex=index; loadSong(currentSongIndex); audio.play(); miniPlay.textContent="⏸️"; cover.classList.add("playing"); });
         
         li.addEventListener("dragstart",()=>{ draggedItem=index; li.classList.add("dragging"); });
         li.addEventListener("dragend",()=>{ li.classList.remove("dragging"); });
         li.addEventListener("dragover",e=>{ e.preventDefault(); });
         li.addEventListener("drop",()=>{ swapSongs(draggedItem,index); loadPlaylist(searchInput.value); });
         
         songList.appendChild(li);
       });
}

// Swap songs for drag & drop
function swapSongs(a,b){ [songs[a],songs[b]]=[songs[b],songs[a]]; }

// Search
searchInput.addEventListener("input",e=>loadPlaylist(e.target.value));

// Initialize
loadPlaylist();
loadSong(currentSongIndex);