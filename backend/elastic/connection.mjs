import elasticsearch from "elasticsearch";

export const client = new elasticsearch.Client({
  hosts: [`${process.env.DB_ELASTIC}:9200`]
});