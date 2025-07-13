import { getMovieById } from '@/utils/getMovieById';
import { NextResponse, NextRequest } from 'next/server';

const plug =
  '/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxIQEBUQEBAVFRUXFxAVFhcXFRAVEhUYFRUWFhcVFRcYHSghGBolGxUVITIhJSkrLi4uGB8zODMsNygtLisBCgoKDg0OFQ8QFy0dHR0rKy0tLS0tLS0tLS8rLS0tLS0tLS0tKzcrLS0tLS0tNy03LTc3LTcrLS0rLSstLS0tLf/AABEIALQBGAMBIgACEQEDEQH/xAAcAAEAAwADAQEAAAAAAAAAAAAABAUGAQIDBwj/xABJEAABAwEFAgkHCAgFBQAAAAABAAIDEQQFEiExBlETIjJBYXGRodEVIzNCU4HBBxRSYnKSk7EkNHOissLS4UNUgoOzCBY1Y7T/xAAXAQEBAQEAAAAAAAAAAAAAAAAAAQID/8QAGxEBAQEBAQEBAQAAAAAAAAAAAAERAjFBIRL/2gAMAwEAAhEDEQA/AMmiIujsIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiCZabrlj1bUb25jxChLcKNabDHJymiu8ZO7QpqayKK5tNwkZxvr0OyPaNe5Vc9mfGaPaR16e46FVXkiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIg26IiyyLgiooRUdy5RBXWm5on5gYD9XTsPwoqq03NKzNtHjo17D8KrTIqusS5pBoRQ7jkVwtlPZ2PFHtB69fcdQqu03C05xup0OzHbqO9NXVCik2mwSR8phpvGbe0ae9RVRyiIgIiICIiAiIgIiICIiAi87RO2Npe80A18B0rH3pe75iRUtZzNHP9repbiW40896wsNHStr0Vd/CCukd8wONBKPeHDvIosUin9Mf3X0NjgRUEEbwQR2rssFYra+E1Y6m8eqesLYXXeDZ2VGThym7v7KytTrU1ERVoREQEREBERBt0RFlkREQEREBERAUO03ZFJq2h3tyPgVMRUZ603E8ZxuDhuOTvA9yrJYnMNHNLT0inZvW0XWRgcKOAI3EAhNXWKRaO03HG7NhLD2t7D4qqtN0ys9XEN7c+7VVdQUREBERAREQEREGW2pteJ4iGjaE/aI+APeVV3dYZLRKyCFpfJI5rGNGpLjQdXWu16uJnkJ+m4dhot//wBP9mY++A54BLIJ3s6HcVlR/pe5c65X19P2N+R6w2SNrrWxtqnpxi+vAtJ9VkehA3uqTrloot13TcV9SWqyRXdwLrM7A57WMhJOJzMTCw72HJw3Za00t4bOvdfEFvN4uYwMcwWWtBIQ1wNONQjjAkYSat10pK22s1uFkf5I4Nlpc9hLiIgXN9Y1eMJdpm7mrz0RH5u+UbYiW6LTwbnY4n1dDJSmIDVrhzPbUV31B56DP3VbDDK1/No77J18fcvvvy4WVzrihfaiz5xHJZi4s5JkcxzZAyvqmrj/AKQvzqg+hWiZsbS95oBqfDesvbtoZHmkfEb7i49Z5vcoFqvCSVoa91Q3TIDmpnTVaj5M9hH3xaHAuMcEdDLIAK51oxlcsRoc9ABXcDbWr1rKG3S68K/77vFTbHfszDm7GNztfvar7xe+xNx2L5rZ3XdNP85kETZGPmeWnijHI8PAaONXLc40yWA+Vf5MRdYFqsrnPsxdhcHUL4XO5IJGrDoDqMga1qpqarrBbWTNxMPWDqDuKkrD3PbDDK014pNHbqHw1W4W5ddOboiIqrboiLLIiIgIiICIiAiIgIiICIiDwtNjjk5bAenR3aM1VWm4eeN/ud4jwV4iprHWmyPj5bCOnUdoyXituoFpuiJ+eHCd7cu7RNXWXRWdpuSRubSHjoyd2HxVVaniIEycWlK1BFKmgr7yqrsi4BrmP7LlBi9oIMFofudRw9+vfVSti9oXXbborY0VwE4m/TY4YXt66E06QFb35dvDsq0cduY6RztWOe0g0IoRkQciFixy6mV+qvIt333PZL3ine8wYSwMeA2rXcI1srSKtc13NlXnqFMt+zMzr2ivL5+9kMcZa6z8bg3cV4qTiw04wJq0ni9VPypdl7WizOx2aeWFxpUxvewkbjhIqOhTL12rt1qbgtFtnkboWukfgPWwGh7FEb35ctuorfIyxWVwfDC4vfIM2yS0LeJva0FwrzlxpkAT8pRaG4blDhwkzciOKDUV+t4Isms8v0H/ANPzIpbptUL/AFppRIASHYHwRtGYzGj6U3FfEL+u4QyDCKMcMtTQjUVPb71ZbB7Zz3RaDNCA9rgGyxuNGyNGYz9Vwzoeap1BoiV+g9ib7uuzXQJbNM+OxxPkjxzYseIvqTpnUvBFBz6aqq2pu75ns3a22m3PtgkBfHLJSp4R7DE1uZqK0OvOaUGShT/LBc1osxjtFllLTQugdDE9riDiy42E8bOpovmXyjfKLJeuGGOPgLLGasjBBLiBQOfTLIZBoyFTqgwy+hQ8kV3N/JYe7LIZZWs5q1d0NGq3a1y3wIiLTaxjuK0VGKeSnDPJpabRXgacVn266nvUea6rRExjpJ5Dm9j8NptGbpXhkBFeZpc3F1HVa5V1/ehH7Wyf/TEpqapjcNqp+sPrwAb+s2mnD1FX6cilcu5dp7itPHwWiQVEHB1tNo4pHpcWWdebd0LUIhrNPuOfEaTyYeFYQPnNorwIHGYfrHf3rwguuYzcGZ5eIXvf+k2ihjkxiFrT9IFhr7tVrFXWf9cm/Y2X+O0JpqnjuG1YW4rQ8u4OQOItNpoZSfNuGWTQNR3I+4rThdS0PxcEwN/SbTQTA8d5y5JGg7lqUTTWYnuS0cctnkArCWfpNoqGtHnQd5OdPgvOx3VNK2OUTS4HycJQ2m0B3APaCxh3PFRU1961EvJPUfyUO4f1Sz/sYP8AjahqnhuK0jBjtEhpw/CUtNo41fRYd1Of4roLitVBW0PrwLmk/ObRTh6nC/TkUpl3LVIhrI2u6rQ1wYJ5MUgjaw/ObQQHsBfMXdBa0ga57lIkuO0VdhnkpwsZaDabRUQjlsP1jzHvVtb/AE9m+3N/wPVghrNR3HaMTcU8lOEkLv0m0VMRHm2j6wNKnvXnBcVpAZjtEhIbNjpabRQuJ80RloBr8VqVwhrIw3TaXteG2iTE1gjqbRaKcO0gvf0sIIoO5SJbitFX4Z5ACYODrabRxQPTYss683wVxdWs37eX8mKehrMuuK0Ysp5KcMDT5zaa8BTNn261z71TbV3POyyOe+Vzg17i7FNM8FjpGiMAOFKiuZ/Nb9UG3f8A4+b/AGv+VilS+Pl933rJAaNNW87Tp7txV8zaSKmbXg84oD31WTXKmsTqxe35eLZo2ujxCjiDXLUV5iqImuqk/wCB/ufyqKoW6IiIgu/Cu+ke0roiDs55OpJ95XVEQFMsd2yy8hpp9I5N7ef3KGpzL1mDAwSENAoKBoIHXSqEau67tbA2gzceU7f0DcFNVDsxZTR07sy7itJzNBqe3L3K+W46zwREVVrvKEPt4vxI/FQL6tsTogGyxk8LZTk9hNGzxlxyOgAJO6hXgzZxzSHC1vqJXTjiRekcKOdpu5tF1j2ZLQ0C1ScQTBvEiyE1eE5s61PUoi48oQ+3i/Ej8U8oQ+3i/Ej8VTHZbKnzp9OBFn5EXogQcHcM9V2m2aL8eK1SHGIQ7iRZ8D6Pmyogt/KEPt4vxI/FQILbF87ldwsdDFZgDjZQlr5yQDXMio7QvF+zri4uNrfUysnPm4vSMFGu07tFxHs45pa4WuSrXTPHEiydKKPOnOEFt5Qh9vF+JH4p5Qh9vF+JH4qnj2YLWtaLVIA2OSIcSLJkhq5unPv1R+zBILTapKOjZCeJFnGw1a3Tv1QWst4Q4T5+LQ/4ke7rUW5LbE2zQNdLGCIoWkF7AQQxoIIrka8yjSbNucXk2uTjmFzuJFmYaBh05qBct2dcHB3zt9RK6cebi9I7V2ndogtfKEPt4vxI/FPKEPt4vxI/FVEWzRZgw2uTicNh4kWXDek5s6rqNlyAG/On0ELrPyIvRONS3Tp11QS7bbYjNZyJYyA6Uk42UAMLwCTXKpICneUIfbxfiR+Kp5dmS4OBtUhxNhYeJFm2E1jGnMQu79nXOJcbXJUysmPm4s5Gcl2nNu0QWvlCH28X4kfinlCH28X4kfiqqPZ1zS1wtclWySSjiRZPkFHO056nLTNdIdmSwNDbVIAxszW8SLISmrxpzkoJd222IGas0YrNIRV7BUENoRnp0qb5Qh9vF+JH4qmOy5wlnzp+ExNgIwRejaatb7jz6rtNs4XYy61v4/Al5wRCvA+j5sqILfyhD7eL8SPxVFtvbInWCZrZY3E8FQB7CTSVhNACvK0WGNrsRtzyeFE/FjiPnQKB2QpoNNFRX5YjJDgjke+j3PaHCNvGkcC85duqJZ+MUvZtmeRUMcRvDXELTXds+xnGlo9271B/UrpScpOWGkjc2Cjmkec5wR6vSoS0+13Ij+078gswpWbMERFEEREBERAWysVijkszGuYM2tzAAd2rGrdXR+rx/ZC1y1ykQxBjQxoyAAHuXoiLToIiINuiIssiIiAiIgIiICIiAi6ySBoq4gDeSAO9QZ74iboS4/VHxNAqLBFn5r/ceQwDpJJPwUCe3Sv5UhpuGQ7AmLjUT2uNnLeB0VqewZqBNfzByGl37o8e5Z5ExcWU99yu5NG9Qqe0qBLM5+bnE9ZJXRFQREQEREFDtbyI/tO/IKptNogNnYxkdJBTE6g9+fPXctfPZ2SUD2h1NKiq8fJkPsWdgWbGbywiKf5SHsIfuO8U8pD/AC8P3Hf1LLmgIp/lIf5eH7jv6k8pD/Lw/cd/UggIrSy24Oka0wQ0Lmg8R1cyBvWn8mQ+xZ2BXGpzrCLdXR6CP7IUCw2SASSxvayofVodSuFwqAK8wVzGwNADRQDQcysjXMdkRFpoREQbdERZZERec07GctwHWQEHoiq5r8ibyQXdQoO/PuUCe/ZDyQ1v7x78u5XFxo1FmvGJmsgruHGPdosvNaXv5byffl2aLxTDF/Pf49RhPS407hVV817yu9bD9kU79VBRVccvcSakkneSSe1cIiAiIgIiICIiAiIgIiICIuCaZnmz7EGWsd0MknljxOwMoK1bWumeXQ5RprDGLUIAXYcTGk1bWp1pl0q52b9HJM7LE9xJ6AK/Fyo4MRmjmd68tex7a+7OnuWHNd/9tRfSk7Wf0qshuphtToC44QCQcsWgO7pWuWRktOC3F9chIWnq5JVsXqSPeG7GMtgjq6lA9ulSRnQ5aZOWnVLfPEtEEvTgJ6K+DnK6VjU+vCexxycuNp6SBXt1UTyOwejfJH9l5p2FWSK4uRmr6sdoAFJHys6BQg9IGvWquO8Z48uEeOg59zluV1ewO5QB6wD+amM3lEued0kLXvNScXMBoSObqRS42BowtAAGgAAA9yKtRq571hb6+I7m59+neoE1/n1Ge9x+A8VSomGJc95yv1eQNzeKO5RCiICIiAiIgIiICIiAiIgIiICIiAiIgIiIChXxLggkP1SPvcX4qaqfaZxMbIxq94HZ/ctUqXx4yO4KwAc7mgfiGp7iVFvGHghZRzjXrqxx7yVNvlofLBZxpXER0DL8g5dNq9InbnO+B+CjNXxWPfBwhtTqZtcXD75r3VWwCz+zbQ8z10cQD1HHVWr1+u17P4Wxsl5xgcevknvKurPJjY1/0g09oqqK6ml1nns55TMY7QafvNKn7Py4rOzoxN7Dl3EJCLJERVoREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQFTXhx7ZCzmaC895/lCuVQwTfpNom5o2lvvFB/Ke1Sp09LB5y2SyczAGDr0+Du1ddrB5pp+v/KfBe2zUNIcR1e5zvgPyPaum1TfMA7nt/JynxPi2a7ig9Fe5UuyY82873DuH91Zsf5gO/8AWD+4q/ZQeZcd7z/C1X6v2EfmrcRzStr7x/dp7U2d4jpofovqOo1H8oXO0Qw8FOPUeK9Rofh3riI4Lc7PKRgI7Af5XdqieVdIiLTQiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIghXvanQxF7aVBbrpmVkRbn4HsypIQ5xzrrXLoRFnr1jr1s7vFIYwPoM/hChbTD9HP2mLhFfjV8VYvd/A8HhbTBhrR1aYab9VabMj9H/wBTvgiKRmeu20jqWc9LmDvr8Fm/KT8Ub8qxgNBocwPpZ56lETpOvW1hdVrSecNPaKruiLToIiICIiD/2Q==';

/**
 * @swagger
 * /movie/{id}/image:
 *   get:
 *     tags:
 *       - Movie
 *     summary: Возвращает изображение фильма по id
 *     description: Возвращает изображение фильма по id
 *     parameters:
 *       - name: id
 *         in: path
 *         type: string
 *         required: true
 *         description: Id фильма
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           image/jpeg:
 *             schema:
 *               type: string
 *               format: binary
 *       404:
 *         description: Фильм не найден
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */

export async function GET(NextRequest: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const id = (await params).id;

  if (!id) {
    return NextResponse.json({ error: 'Id отсутствует' }, { status: 422 });
  }

  const movie = await getMovieById(id, true);

  if (!movie) {
    return NextResponse.json({ error: 'Фильм не найден' }, { status: 404 });
  }
  const imageBuffer = Buffer.from(movie.file ?? plug, 'base64');

  return new NextResponse(imageBuffer, {
    headers: {
      'Content-Type': 'image/jpeg',
      'Content-Disposition': 'inline; filename="your-image.jpg"'
    }
  });
}
