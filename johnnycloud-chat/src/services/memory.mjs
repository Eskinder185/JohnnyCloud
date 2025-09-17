import { DynamoDBClient, QueryCommand, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { REGION, CHAT_TABLE, MAX_TURNS, TTL_DAYS } from "../config.mjs";

const ddb = new DynamoDBClient({ region: REGION });

export async function fetchHistory(threadId, limit = MAX_TURNS) {
  const q = await ddb.send(new QueryCommand({
    TableName: CHAT_TABLE,
    KeyConditionExpression: "threadId = :t",
    ExpressionAttributeValues: { ":t": { S: threadId } },
    ScanIndexForward: true
  }));
  const items = (q.Items || []).map(i => ({
    role: i.role?.S, content: i.content?.S, ts: Number(i.ts?.N)
  }));
  return items.filter(m => m.role === "user" || m.role === "assistant").slice(-limit);
}

export async function saveTurn(threadId, { role, content }) {
  const ts = Date.now();
  const Item = {
    threadId: { S: threadId },
    ts: { N: String(ts) },
    role: { S: role },
    content: { S: String(content || "") }
  };
  if (TTL_DAYS > 0) Item.ttl = { N: String(Math.floor(ts/1000) + TTL_DAYS*86400) };
  await ddb.send(new PutItemCommand({ TableName: CHAT_TABLE, Item }));
}
