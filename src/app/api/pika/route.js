import { NextResponse } from 'next/server';
const { Client } = require("@notionhq/client")
 
export async function POST(req) {
    const notion = new Client({
        auth: process.env.NOTION_TOKEN
    });
    
    //https://www.notion.so/fe389595cda647feaf1866e542639693
    const imageURLs = await notion.databases.query({
        database_id: "fe389595cda647feaf1866e542639693"
    }).then((data) => {
        let results = data.results;
        return results.map((result) => {
            let properties = result.properties;
            return {
                image: properties['URL']['url'],
            }
        });
    });
            
    const urlSelect = Math.floor(Math.random() * imageURLs.length);

    const data =  {
        url: imageURLs[urlSelect]['image'],
    };
 
    return NextResponse.json({ ...data });
}