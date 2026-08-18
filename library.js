/* ALON HISTORYVERSE 24 — Library module bridge */
export function initLibrarySystem(){
  const lib=window.ALON_HISTORYVERSE_LIBRARY;
  if(lib?.init) return lib.init();
  return null;
}
export function openLibrary(){location.href='library.html';}
export function getLibrarySystem(){return window.ALON_HISTORYVERSE_LIBRARY||null;}
