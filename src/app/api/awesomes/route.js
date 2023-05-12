import { NextResponse } from 'next/server';
const { Client } = require("@notionhq/client")
 
export async function POST(req) {
    const notion = new Client({
        auth: process.env.NOTION_TOKEN
    });
    // bb24dbc2cdf74a7d8792a7ed7153c08e
    const { domain } = await req.json();

    if (!domain) {
        return NextResponse.json({ error: 'Bad Request' });
    }

    const response = await notion.databases.query({
        database_id: "bb24dbc2cdf74a7d8792a7ed7153c08e",
        filter: {

            "and": [
                {
                    "property": "domain-match",
                    "title": {
                        "equals": domain.split('.')[0]
                    }
                },
                {
                    "property": "enabled",
                    "checkbox": {
                        "equals": true
                    }
                }
            ]
        }
    }).then((data) => {
        try {
            let properties = data.results[0]['properties'];
            return {
                url: properties['redirect-url']['url'],
                text: {
                    h1: properties['h1-text']['rich_text'][0]['plain_text'],
                    h3: properties['h3-text']['rich_text'][0]['plain_text'],
                    linkText: properties['link-text']['rich_text'][0]['plain_text']
                }
            }
        } catch {
            return {
                text: {
                    h1: 'Hello World'
                }
            }
        }
    });

    const data = response;
 
    return NextResponse.json({ ...data });
}