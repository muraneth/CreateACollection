import './App.css'
import {
  DB3BrowserWallet,
  DB3Client,
  initializeDB3,
  collection,
  Index
} from 'db3.js'
import { useState } from 'react'
import { useAsyncFn } from 'react-use'

interface Todo {
  text: string
  owner: string
}
export default function App() {
  // do not use your own seed
  const mnemonic =
    'result crisp session latin must fruit genuine question prevent start coconut brave speak student dismiss'
  const wallet = DB3BrowserWallet.createNew(mnemonic, 'DB3_SECP256K1')
  const [cname, setCollection] = useState('')
  // a database address has been created 
  // you can go to https://replit.com/@imotai/ConnectToDB3 to learn how to create a database
  const dbAddress = "0x7552384682b9e34becf02a008eef552fc9973e5c"
  const [res2, createCollection] = useAsyncFn(async () => {
    try {
      setCollection("todos")
      const { db } = initializeDB3('https://grpc.devnet.db3.network', dbAddress, wallet)
      const indexList: Index[] = [
        {
          name: 'ownerIndex',
          id: 1,
          fields: [
            {
              fieldPath: 'owner',
              valueMode: {
                oneofKind: 'order',
                order: 1, // asc
              },
            },
          ],
        },
      ]
      // if the collection todos do not exist, the sdk will create it
      const collectionRef = await collection<Todo>(db, 'todos', indexList)

    } catch (e) {
      console.log(e)
    }
  }, [])
  if (cname.length == 0) {
    createCollection()
  }
  return (
    <main>
      <h1>{cname}</h1>
    </main>
  )
}