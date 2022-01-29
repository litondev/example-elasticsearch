import elasticsearch from "elasticsearch";

const client = new elasticsearch.Client({
  hosts: ["http://localhost:9200"]
});

module.exports = client;