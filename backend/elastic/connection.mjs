import { Client } from "@elastic/elasticsearch";

export const client = new Client({
  node : `http://${process.env.DB_ELASTIC}:9200` 
});