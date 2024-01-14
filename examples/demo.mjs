import rewriteFetch from "./rewrite";

const rules = [
  {
    url: "/pathfinder/v1/query",
    query: /operationName=home&/,
    rewrite: {
      json(data) {
        const block = ["Episodes for you", "Audiobooks for you"];
        data.data.home.sectionContainer.sections.items =
          data.data.home.sectionContainer.sections.items.filter((res) => {
            return !block.includes(res.data.title?.text);
          });
        return data;
      },
    },
  },
];

rewriteFetch(rules);
