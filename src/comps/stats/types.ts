export type ChartType = 'transfers' | 'calls' | 'peaks'

export interface SiteStats {
  totalCalls: number
  answeredCalls: number
  missedCalls: number
  averageWaitTime: string
  averageCallDuration: string
  answerRate: string
  missRate: string
}