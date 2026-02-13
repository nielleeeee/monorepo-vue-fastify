import { orpc } from "../orpc/baseOs";
import { bigQueryClient } from "../config/bigquery";

export const bigQueryRouter = {
    sampleBigQuery: orpc.handler(async () => {
        const sqlQuery = `SELECT
        CONCAT(
          'https://stackoverflow.com/questions/',
          CAST(id as STRING)) as url,
        view_count
        FROM \`bigquery-public-data.stackoverflow.posts_questions\`
        WHERE tags like '%google-bigquery%'
        ORDER BY view_count DESC
        LIMIT 10`;

        const options = {
            query: sqlQuery,
            // location: "AU",
        };

        const [rows] = await bigQueryClient.query(options);

        console.log("Query Results:");

        rows.forEach((row) => {
            const url = row["url"];
            const viewCount = row["view_count"];
            console.log(`url: ${url}, ${viewCount} views`);
        });
    }),
};

export type BigQueryRouter = typeof bigQueryRouter;

