const router = require('express').Router()

const notFound = (res, msg = 'Not Found') => res.status(404).send(msg)

router.get('/', (req, res) => {
  const echostr = req.query.echostr

  if (echostr) {
    console.log(`WeChat - Got echostr: ${echostr}`)
    return res.send(echostr)
  } else {
    const error = 'WeChat - Error: no echo string'
    console.log(error)
    return notFound(res, error)
  }
})

const createMessage = (to, from, content) => `
  <xml>
    <ToUserName><![CDATA[${to}]]></ToUserName>
    <FromUserName><![CDATA[${from}]]></FromUserName>
    <CreateTime>${new Date().getTime() / 1000}</CreateTime>
    <MsgType><![CDATA[text]]></MsgType>
    <Content><![CDATA[${content}]]></Content>
    <FuncFlag>0</FuncFlag>
  </xml>
`
const handleEvent = (res, xml) => {
  const [event] = xml.Event
  if (event === 'subscribe') {
    const msg = createMessage(
      xml.FromUserName[0],
      xml.ToUserName[0],
      'Welcome to our Official Account!',
    )
    console.log(`WeChat - Responding with: ${msg}`)
    return res.send(msg)
  } else {
    return notFound(res)
  }
}
const handleText = (res, xml) => {
  const msg = createMessage(
    xml.FromUserName[0],
    xml.ToUserName[0],
    xml.Content[0]
      .split('')
      .reverse()
      .join(''),
  )
  console.log(`WeChat - Responding with: ${msg}`)
  return res.send(msg)
}
const handleUnknown = (res, xml) => {
  const msg = createMessage(
    xml.FromUserName[0],
    xml.ToUserName[0],
    "Sorry, I don't understand what you just sent...",
  )
  console.log(`WeChat - Responding with: ${msg}`)
  return res.send(msg)
}

router.post('/', (req, res) => {
  const { xml } = req.body
  console.log(`WeChat - Got request: ${JSON.stringify(xml)}`)
  switch (xml.MsgType[0]) {
    case 'event':
      return handleEvent(res, xml)
    case 'text':
      return handleText(res, xml)
    default:
      return handleUnknown(res, xml)
  }

  return notFound(res)
})

module.exports = router
