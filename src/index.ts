import { LineNotify } from '@inkohx/line-notify'
import fetch from 'node-fetch'

interface Prefecture {
  id: number,
  name_ja: string,
  name_en: string,
  lat: number,
  lng: number,
  cases: number,
  deaths: number
}

interface Total {
  date: number,
  pcr: number,
  positive: number,
  symptom: number,
  symptomless: number,
  symtomConfirming: number,
  hospitalize: number,
  mild: number,
  severe: number,
  confirming: number,
  waiting: number,
  discharge: number,
  death: number
}

const BASE_URL = 'https://covid19-japan-web-api.now.sh/api/v1'

async function run (): Promise<void> {
  const notify = new LineNotify()
  const prefecture = await fetchPrefectures()
  const total = await fetchTotal()

  notify.send([
    '「COVID-19」の情報',
    '',
    `= ${prefecture.name_ja} =`,
    `感染者数: ${prefecture.cases}人`,
    `死者数: ${prefecture.deaths}人`,
    '',
    '= 日本国内 =',
    `検査人数: ${total.pcr}人`,
    `入院者数: ${total.hospitalize}人`,
    `退院者数: ${total.discharge}人`,
    `死者数: ${total.death}人`
  ].join('\n'))
    .catch(console.error)
}

async function fetchPrefectures (): Promise<Prefecture> {
  const prefecturesId = process.env.PREFECTURE_ID

  if (!prefecturesId) throw new Error('The environment variable "PREFECTURE_ID" has not been set.')

  const data = await fetch(BASE_URL + '/prefectures')
    .then(res => res.json())
    .then((res: Prefecture[]) => res.find(value => value.id === Number(prefecturesId)))

  if (!data) throw new Error('No matches were found for the prefecture ID.')

  return data
}

async function fetchTotal (): Promise<Total> {
  const data: Total = await fetch(BASE_URL + '/total')
    .then(res => res.json())

  return data
}

run()
  .catch(console.error)
