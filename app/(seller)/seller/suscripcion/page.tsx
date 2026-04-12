import { Check, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { plans, formatPrice } from '@/lib/mock-data'

const paymentHistory = [
  { id: '1', date: '1 abril 2026', plan: 'Básico', amount: 500, status: 'Pagado' },
  { id: '2', date: '1 marzo 2026', plan: 'Básico', amount: 500, status: 'Pagado' },
  { id: '3', date: '1 febrero 2026', plan: 'Básico', amount: 500, status: 'Pagado' },
  { id: '4', date: '1 enero 2026', plan: 'Gratis', amount: 0, status: 'N/A' },
]

export default function SuscripcionPage() {
  const currentPlan = 'basic'

  return (
    <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="font-serif text-2xl md:text-3xl font-bold">
            Suscripción
          </h1>
          <p className="text-muted-foreground mt-1">
            Gestiona tu plan y método de pago
          </p>
        </div>

        {/* Plans */}
        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((plan) => {
            const isCurrent = plan.id === currentPlan
            return (
              <Card 
                key={plan.id} 
                className={`relative ${plan.highlighted ? 'border-primary shadow-lg' : ''} ${isCurrent ? 'ring-2 ring-primary' : ''}`}
              >
                {plan.highlighted && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Star className="h-3 w-3 mr-1" />
                    Más popular
                  </Badge>
                )}
                {isCurrent && (
                  <Badge variant="secondary" className="absolute -top-3 right-4">
                    Plan actual
                  </Badge>
                )}
                <CardHeader>
                  <CardTitle>{plan.name}</CardTitle>
                  <CardDescription>
                    {plan.price === 0 ? (
                      <span className="text-3xl font-bold text-foreground">Gratis</span>
                    ) : (
                      <>
                        <span className="text-3xl font-bold text-foreground">
                          {formatPrice(plan.price)}
                        </span>
                        <span className="text-muted-foreground">/mes</span>
                      </>
                    )}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  {isCurrent ? (
                    <Button variant="outline" className="w-full" disabled>
                      Plan actual
                    </Button>
                  ) : plan.price > plans.find(p => p.id === currentPlan)!.price ? (
                    <Button className="w-full">
                      Actualizar a {plan.name}
                    </Button>
                  ) : (
                    <Button variant="outline" className="w-full">
                      Cambiar a {plan.name}
                    </Button>
                  )}
                </CardFooter>
              </Card>
            )
          })}
        </div>

        {/* Current Plan Details */}
        <Card>
          <CardHeader>
            <CardTitle>Tu plan actual</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <p className="text-lg font-semibold">Plan Básico</p>
                <p className="text-muted-foreground">
                  Próxima facturación: 1 de mayo, 2026
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">{formatPrice(500)}</p>
                <p className="text-sm text-muted-foreground">por mes</p>
              </div>
            </div>
            <div className="mt-6 pt-6 border-t">
              <h4 className="font-medium mb-3">Uso del plan</h4>
              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span>Productos publicados</span>
                    <span className="font-medium">34 / 100</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: '34%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span>Productos destacados</span>
                    <span className="font-medium">3 / 5</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: '60%' }} />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment History */}
        <Card>
          <CardHeader>
            <CardTitle>Historial de pagos</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Monto</TableHead>
                  <TableHead>Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paymentHistory.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell>{payment.date}</TableCell>
                    <TableCell>{payment.plan}</TableCell>
                    <TableCell>
                      {payment.amount > 0 ? formatPrice(payment.amount) : '-'}
                    </TableCell>
                    <TableCell>
                      {payment.status === 'Pagado' ? (
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          {payment.status}
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground">{payment.status}</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
  )
}
