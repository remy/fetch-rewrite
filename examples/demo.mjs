((t=[
  {
    url: "/pathfinder/v1/query",
    query: /operationName=home&/,
    rewrite: {
      json(data) {
        const block = ["Episodes for you", "Audiobooks for you", "Spotify original podcasts"];
        data.data.home.sectionContainer.sections.items =
          data.data.home.sectionContainer.sections.items.filter((res) => {
            return !block.includes(res.data.title?.text);
          });
        return data;
      },
    },
  },
])=>{const e=fetch;fetch=async(n,r={})=>{const i=t.find((t=>{let{url:e,query:r}=t;return"string"==typeof n&&(n="undefined"!=typeof window?new URL(n,window.location.origin):new URL(n)),n.pathname===e&&(!r||r.test(n.search))})),c=await e(n,r);if(!i)return c;if(!i.rewrite)return c;const{rewrite:o}=i,f={};for(let t in o)t in c&&(f[t]=c[t].bind(c),c[t]=(...e)=>f[t](...e).then((e=>{try{return o[t](e)}catch(t){return e}})));return c}})();
