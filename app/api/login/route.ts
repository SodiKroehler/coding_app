import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  const { email, pin } = await req.json()

  if (!email || !pin) {
    return NextResponse.json({ error: 'Email and PIN required' }, { status: 400 })
  }

  const supabase = createServerClient()
  const { data: rater, error } = await supabase
    .from('raters')
    .select('id, name, email, pin')
    .eq('email', email.trim().toLowerCase())
    .single()

  if (error || !rater) {
    return NextResponse.json({ error: 'Invalid email or PIN' }, { status: 401 })
  }

  if (rater.pin !== pin) {
    return NextResponse.json({ error: 'Invalid email or PIN' }, { status: 401 })
  }

  return NextResponse.json({ id: rater.id, name: rater.name, email: rater.email })
}
