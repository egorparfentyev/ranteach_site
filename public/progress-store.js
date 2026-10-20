// Each account and the guest have separate browser storage. Passwords never enter this store.
(function(){
 let owner='guest';
 const prefix='ranteach-progress:';
 window.RTProgress={
  get owner(){return owner;},
  use(uid){owner=uid||'guest';},
  getItem(key){const scoped=prefix+owner+':'+key;let value=localStorage.getItem(scoped);if(owner==='guest'&&value===null){value=localStorage.getItem(key);if(value!==null){localStorage.setItem(scoped,value);localStorage.removeItem(key);}}return value;},
  setItem(key,value){localStorage.setItem(prefix+owner+':'+key,value);window.RanTeachAccount?.changed();},
  removeItem(key){localStorage.removeItem(prefix+owner+':'+key);},
  clearUser(uid){Object.keys(localStorage).filter(k=>k.startsWith(prefix+uid+':')).forEach(k=>localStorage.removeItem(k));}
 };
})();
