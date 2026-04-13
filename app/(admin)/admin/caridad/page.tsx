'use client'

import { Plus, Heart, Calendar, Target, TrendingUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { AdminLayout } from '@/components/admin-layout'
import { formatPrice } from '@/lib/mock-data'

const currentGoal = {
  title: 'Uniformes escolares para niños de bajos recursos',
  beneficiary: 'Fundación Educando RD',
  target: 50000,
  current: 32500,
  period: 'Abril 2026',
  percentageOfRevenue: 5,
}

const pastDonations = [
  {
    id: '1',
    title: 'Ropa de invierno para comunidades de montaña',
    beneficiary: 'Cruz Roja Dominicana',
    amount: 45000,
    date: 'Marzo 2026',
    status: 'completed'
  },
  {
    id: '2',
    title: 'Kit de uniformes para escuela rural',
    beneficiary: 'Fundación Educando RD',
    amount: 38000,
    date: 'Febrero 2026',
    status: 'completed'
  },
  {
    id: '3',
    title: 'Ropa para damnificados por inundaciones',
    beneficiary: 'Defensa Civil',
    amount: 52000,
    date: 'Enero 2026',
    status: 'completed'
  },
  {
    id: '4',
    title: 'Donación navideña de ropa infantil',
    beneficiary: 'Aldeas Infantiles SOS',
    amount: 65000,
    date: 'Diciembre 2025',
    status: 'completed'
  },
]

export default function CaridadPage() {
  const progress = (currentGoal.current / currentGoal.target) * 100

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-serif text-2xl md:text-3xl font-bold">
              Módulo de Caridad
            </h1>
            <p className="text-muted-foreground mt-1">
              Gestiona las metas de donación de PACAPP
            </p>
          </div>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Crear nueva meta
          </Button>
        </div>

        {/* Current Goal - Piggy Bank Visual */}
        <Card className="overflow-hidden">
          <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-primary" />
                <Badge variant="secondary">Meta actual</Badge>
              </div>
              <CardTitle className="text-xl mt-2">{currentGoal.title}</CardTitle>
              <CardDescription>{currentGoal.beneficiary}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col lg:flex-row items-center gap-8">
                {/* Piggy Bank SVG */}
                <div className="relative w-48 h-48 flex-shrink-0">
                  <svg viewBox="0 0 200 200" className="w-full h-full">
                    {/* Piggy bank body outline */}
                    <ellipse cx="100" cy="115" rx="70" ry="55" fill="#f1f5f9" stroke="#e2e8f0" strokeWidth="3"/>
                    
                    {/* Fill based on progress */}
                    <defs>
                      <clipPath id="piggyClip">
                        <ellipse cx="100" cy="115" rx="67" ry="52"/>
                      </clipPath>
                    </defs>
                    <rect 
                      x="30" 
                      y={170 - (progress * 1.04)} 
                      width="140" 
                      height={progress * 1.04} 
                      fill="#0F7B5A"
                      clipPath="url(#piggyClip)"
                      className="transition-all duration-1000"
                    />
                    
                    {/* Coin slot */}
                    <rect x="85" y="55" width="30" height="8" rx="4" fill="#94a3b8"/>
                    
                    {/* Ear */}
                    <ellipse cx="155" cy="85" rx="15" ry="20" fill="#f1f5f9" stroke="#e2e8f0" strokeWidth="3"/>
                    
                    {/* Legs */}
                    <rect x="55" y="160" width="15" height="20" rx="4" fill="#f1f5f9" stroke="#e2e8f0" strokeWidth="2"/>
                    <rect x="80" y="160" width="15" height="20" rx="4" fill="#f1f5f9" stroke="#e2e8f0" strokeWidth="2"/>
                    <rect x="105" y="160" width="15" height="20" rx="4" fill="#f1f5f9" stroke="#e2e8f0" strokeWidth="2"/>
                    <rect x="130" y="160" width="15" height="20" rx="4" fill="#f1f5f9" stroke="#e2e8f0" strokeWidth="2"/>
                    
                    {/* Snout */}
                    <ellipse cx="40" cy="115" rx="18" ry="15" fill="#fecaca" stroke="#fca5a5" strokeWidth="2"/>
                    <circle cx="35" cy="112" r="3" fill="#f87171"/>
                    <circle cx="45" cy="112" r="3" fill="#f87171"/>
                    
                    {/* Eye */}
                    <circle cx="65" cy="95" r="5" fill="#1e293b"/>
                    <circle cx="67" cy="93" r="2" fill="white"/>
                    
                    {/* Tail */}
                    <path d="M170 115 Q185 100 175 85 Q165 95 170 115" fill="none" stroke="#fecaca" strokeWidth="4" strokeLinecap="round"/>
                  </svg>
                  
                  {/* Percentage overlay */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-3xl font-bold text-primary">{Math.round(progress)}%</span>
                  </div>
                </div>

                {/* Goal Details */}
                <div className="flex-1 space-y-6">
                  {/* Amount Display */}
                  <div className="text-center lg:text-left">
                    <p className="text-4xl md:text-5xl font-bold text-primary">
                      {formatPrice(currentGoal.current)}
                    </p>
                    <p className="text-lg text-muted-foreground">
                      de {formatPrice(currentGoal.target)}
                    </p>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <Progress value={progress} className="h-4" />
                    <p className="text-sm text-muted-foreground text-center lg:text-left">
                      Faltan {formatPrice(currentGoal.target - currentGoal.current)} para alcanzar la meta
                    </p>
                  </div>

                  {/* Meta Info */}
                  <div className="grid grid-cols-2 gap-4">
                    <Card>
                      <CardContent className="p-4 flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <Target className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Meta</p>
                          <p className="font-semibold">{formatPrice(currentGoal.target)}</p>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <TrendingUp className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">% de ingresos</p>
                          <p className="font-semibold">{currentGoal.percentageOfRevenue}%</p>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <Calendar className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Período</p>
                          <p className="font-semibold">{currentGoal.period}</p>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <Heart className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Beneficiario</p>
                          <p className="font-semibold text-sm truncate">{currentGoal.beneficiary}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </CardContent>
          </div>
        </Card>

        {/* Donation History */}
        <Card>
          <CardHeader>
            <CardTitle>Historial de donaciones</CardTitle>
            <CardDescription>
              Todas las metas completadas anteriormente
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pastDonations.map((donation) => (
                <div 
                  key={donation.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-lg border bg-card hover:shadow-sm transition-shadow"
                >
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                      <Heart className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">{donation.title}</h4>
                      <p className="text-sm text-muted-foreground">{donation.beneficiary}</p>
                      <p className="text-xs text-muted-foreground mt-1">{donation.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 sm:flex-col sm:items-end">
                    <p className="text-xl font-bold text-primary">{formatPrice(donation.amount)}</p>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      Completada
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Impact Summary */}
        <div className="grid sm:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-4xl font-bold text-primary">RD$200,000+</p>
              <p className="text-muted-foreground mt-2">Total donado</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-4xl font-bold text-primary">5</p>
              <p className="text-muted-foreground mt-2">Organizaciones beneficiadas</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-4xl font-bold text-primary">500+</p>
              <p className="text-muted-foreground mt-2">Familias impactadas</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  )
}
