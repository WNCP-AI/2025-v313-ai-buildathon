import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function getUser() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (error || !user) {
    return null
  }
  
  return user
}

export async function requireAuth() {
  const user = await getUser()
  
  if (!user) {
    redirect('/auth/login')
  }
  
  return user
}

export async function getProfile() {
  const supabase = await createClient()
  const user = await getUser()
  
  if (!user) {
    return null
  }
  
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()
  
  if (error) {
    console.error('Error fetching profile:', error)
    return null
  }
  
  return profile
}

export async function requireProfile() {
  const profile = await getProfile()
  
  if (!profile) {
    redirect('/auth/login')
  }
  
  return profile
}

export async function requireProvider() {
  const supabase = await createClient()
  const user = await requireAuth()
  
  const { data: provider, error } = await supabase
    .from('providers')
    .select('*')
    .eq('user_id', user.id)
    .single()
  
  if (error || !provider) {
    redirect('/provider/onboarding')
  }
  
  return provider
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/')
}