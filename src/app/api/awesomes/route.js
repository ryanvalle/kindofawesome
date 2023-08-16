import { NextResponse } from 'next/server';
const { Client } = require("@notionhq/client")
 
export async function POST(req) {
    const notion = new Client({
        auth: process.env.NOTION_TOKEN
    });
    // bb24dbc2cdf74a7d8792a7ed7153c08e
    const { domain } = await req.json();
    let response;

    if (!domain) {
        return NextResponse.json({ error: 'Bad Request' });
    }

    if (domain === 'iskindofaweso.me') {
        console.log('match')
        return NextResponse.json({
            text: {
                h1: 'hello world'
            }
        })
    }
    const subdomain = domain.replace('.iskindofaweso.me', '');
    // 25476b578623446087283349875b7bd7
    const redirectURLs = await notion.databases.query({
        database_id: "25476b578623446087283349875b7bd7"
    }).then((data) => {
        let results = data.results;
        return results.map((result) => {
            let properties = result.properties;
            return {
                url: properties['redirect-url']['url'],
                text: {
                    linkText: (properties['link-text']['rich_text'][0] || {})['plain_text']
                }
            }
        });
    });
    
    response = await notion.databases.query({
        database_id: "bb24dbc2cdf74a7d8792a7ed7153c08e",
        filter: {

            "and": [
                {
                    "property": "domain-match",
                    "title": {
                        "equals": subdomain
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
        if (data.results.length) {
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
                        h1: 'Errors',
                        h3: 'are not awesome...'
                    }
                }
            }
        } else {
            
            const h3Options = [
                'is kind of awesome.',
                'is kind of awesome?',
                'is kind of awesome!',
                'is kind of...awesome',
                'is kind... of awesome',
                'is kind of awesome...',
                'is (placeholder text)'
            ]
            const select = Math.floor(Math.random() * h3Options.length);
            const urlSelect = Math.floor(Math.random() * redirectURLs.length);
            return {
                url: redirectURLs[urlSelect]['url'],
                text: {
                    h1: subdomain,
                    h3: h3Options[select],
                    linkText: redirectURLs[urlSelect]['text']['linkText']
                }
            }
        }
    });

    const data = response;
 
    return NextResponse.json({ ...data });
}