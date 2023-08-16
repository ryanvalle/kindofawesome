'use client';
 
import { useEffect, useState } from 'react';
import Image from 'next/image'

import { Oswald, Roboto } from 'next/font/google'
import Link from 'next/link';

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['100','300', '500']
})

const oswald = Oswald({
  subsets: ['latin'],
  weight: ['400','700']
})
 
export default function Funtext() {
    const [h1Text, setH1] = useState();
    const [h3Text, setH3] = useState();
    const [url, setURL] = useState();
    const [linktext, setLinkText] = useState();
    const [isHidden, setHidden] = useState(true);
    const [isPika, setPika] = useState();

    var isPikaPage = window.location.host.split('.')[0].toLowerCase() === 'pikachu';
    var apiURL = isPikaPage ? '/api/pika' : '/api/awesomes';

      useEffect(() => {
        fetch(apiURL, {
            method: 'POST',
            body: JSON.stringify({domain: location.host}),
            headers: {
                "Content-Type": "application/json",
                // 'Content-Type': 'application/x-www-form-urlencoded',
              }
        })
        .then((response) => response.json())
        .then((resp) => {
          setPika(isPikaPage);
          if (!isPikaPage) {
            setH1(resp.text.h1);
            setH3(resp.text.h3);
            setLinkText(resp.text.linkText);
          }
            setURL(resp.url);
            setTimeout(() => {
                setHidden(false)
            }, 500)
        });
    }, [])
 
  return (
    <>
      <div className={`absolute w-screen h-screen flex items-center align-center ${!isHidden ? 'opacity-0 scale-100' : 'opacity-1 scale-125'} transition-all duration-1000`}>
        <Image 
          src="/loader.svg"
          width={300}
          height={300}
          className='w-screen'
        />
      </div>
      <div className={`text-center w-screen ${isHidden ? 'opacity-0 scale-75' : 'opacity-1 scale-100'} transition-all duration-1000 text-se`}>
        <h1 className={`uppercase font-bold ${oswald.className} text-6xl text-black text-shadow`}>{!isPika ? h1Text : 'Pika Pika'}</h1>
        {!isPika && <h3 className={`${roboto.className} uppercase font-bold text-black text-xl pt-[10px] pb-[40px]`}>{h3Text}</h3>}
        {!isPika && url && linktext && <Link
            href={url} 
            target="_blank"
            className={`custom-button ${oswald.className} text-black px-[20px] py-[10px] mt-[30px] rounded-md`}>
                {linktext}</Link>}
        {isPika && url && <Image src={url} width={400} height={400} className='object-contain mt-5 ml-auto mr-auto'/>}
      </div>
    </>
  );
}