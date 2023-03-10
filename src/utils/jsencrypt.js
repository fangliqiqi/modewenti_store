import JSEncrypt from 'jsencrypt/bin/jsencrypt.min'

// 密钥对生成 http://web.chacuo.net/netrsakeypair

const publicKey = 'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDt30AcO8CSAfzSa5L8ikVrfehH6aFw9KyL85NzOAduOfnPcbiAGLjLWEKOkOhkYrlSAfU5s+pa3OQTsgpfCkVVm56dEQh8sajIR4uyGbhv0/CdvPTZS5o3sP6Yi9TemWZ443+QNjajN6MSCTmTY86ZoR9jmTcJtV4kNTQWDov6qQIDAQAB'

const privateKey = 'MIICdwIBADANBgkqhkiG9w0BAQEFAASCAmEwggJdAgEAAoGBALrhumePhK8m89u1jk9/hIhVDJ5BbDkwdmbBMYCrcWjlRsi6pC5NsgE0Ulm2YG/c4CcnhvniMsK6AEbv9ausbZzYwnwdGtONb9OJrFkbuElPmRJi6xMko57wAmLq48dZlFwN2Kd1NXZfZl21q3VGbaaecmfoiEQhUmjuBMgp/tUhAgMBAAECgYACDlOvqfuKtcH/C8tKApwhp9Xgs9WN94OF8+AoizpPLh6OPMdrnv0zWDEDvabn9CUfKScp/pwSWluAbElmnxoBl+DjN+DGxbBOeeVO49cAKkLF86M1JFBhFlZl2kNLae1V9koRhcJTayK0ZA605TbJez63K7anlKPBa13nLIRQVQJBAPtjk6SdOLVrGJVUUa1PzN2nDDHyeJsIiAKLAKcp5g0NSKzdmotIn3gYwvsnJR6nTNgY6Dz0LSEVkx5dokmVD0sCQQC+T0BBGk/Cr8/U0eQ6QLelznFGN+ITL1z5uKXYzNAtXv41TBJNCpoGJlxScu6KmEz7LxlCisD4qXacaNHuzC3DAkAFaZBtM+FbrpGZ7XXQuG4du5H8pU7Jb7aV7241KybD0yxkZGUGaKreSBIynBYlgc6avHaLkWpDUxaWycdLtETfAkEAizCxoSwaXB10l4ZwM370Euw8AwyKaFfC286GVlvugtCwgtDBreFsJ8VUzuTKvUmJPEoFYprTasufOeScbtidOwJBAO8/l7r/rvaVwV4XUC6bzkOfsrEERp7P1yEWDAngmQLeybfpV3bLYYWxsqalgzW72csachqjH64WRtEtL62orA4=+pa3OQTsgpfCkVVm56dEQh8sajIR4uyGbhv0/CdvPTZS5o3sP6Yi9TemWZ443+QNjajN6MSCTmTY86ZoR9jmTcJtV4kNTQWDov6qQIDAQAB'


// 加密
export function encrypt(txt) {
  const encryptor = new JSEncrypt()
  encryptor.setPublicKey(publicKey) // 设置公钥
  return encryptor.encrypt(txt) // 对数据进行加密
}

// 解密
export function decrypt(txt) {
  const encryptor = new JSEncrypt()
  encryptor.setPrivateKey(privateKey) // 设置私钥
  return encryptor.decrypt(txt) // 对数据进行解密
}

