import Login from '@/components/modules/auth/Login'
import React from 'react'



interface LoginParams {
  searchParams: Promise<{ redirect?: string }>;
}

const LoginPage = async({ searchParams }: LoginParams) => {
  const params = await searchParams;
  const redirectPath = params.redirect;
  return (
    <div>
      <Login redirectPath={redirectPath} />
    </div>
  )
}

export default LoginPage
