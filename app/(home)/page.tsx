"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dumbbell, Bike, UserRoundCogIcon, SwatchBook, Heart, Utensils, Brain } from "lucide-react"
import React from "react"


// Helper function to generate random challenges
const generateChallenges = (count: number) => {
  const activities = [
    { name: "Qadam", icon: <UserRoundCogIcon className="w-6 h-6" />, unit: "qadam" },
    { name: "Push-up", icon: <Dumbbell className="w-6 h-6" />, unit: "marta" },
    { name: "Velosiped", icon: <Bike className="w-6 h-6" />, unit: "km" },
    { name: "Suzish", icon: <SwatchBook className="w-6 h-6" />, unit: "m" },
    { name: "Yugurish", icon: <UserRoundCogIcon className="w-6 h-6" />, unit: "km" },
    { name: "Yoga", icon: <Heart className="w-6 h-6" />, unit: "daqiqa" },
    { name: "Meditatsiya", icon: <Brain className="w-6 h-6" />, unit: "daqiqa" },
    { name: "Sog'lom ovqatlanish", icon: <Utensils className="w-6 h-6" />, unit: "kun" },
  ]

  const categories = ["Kardio", "Kuch", "Moslashuvchanlik", "Balans", "Aqliy salomatlik"]

  return Array.from({ length: count }, (_, i) => {
    const activity = activities[Math.floor(Math.random() * activities.length)]
    return {
      id: i + 4, // Starting from 4 to account for the initial 3 challenges
      name: `${Math.floor(Math.random() * 100) + 1} ${activity.name}`,
      icon: activity.icon,
      target: Math.floor(Math.random() * 1000) + 100,
      current: 0,
      unit: activity.unit,
      category: categories[Math.floor(Math.random() * categories.length)]
    }
  })
}

// Combine initial challenges with generated ones
const allChallenges = [ ...generateChallenges(100)]

export default function Component() {
  const [challenges, setChallenges] = useState(allChallenges)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("Barchasi")
  const [currentPage, setCurrentPage] = useState(1)
  const challengesPerPage = 9

  const filteredChallenges = challenges.filter(challenge => 
    challenge.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (selectedCategory === "Barchasi" || challenge.category === selectedCategory)
  )

  const indexOfLastChallenge = currentPage * challengesPerPage
  const indexOfFirstChallenge = indexOfLastChallenge - challengesPerPage
  const currentChallenges = filteredChallenges.slice(indexOfFirstChallenge, indexOfLastChallenge)

  const updateProgress = (id: number, increment: boolean) => {
    setChallenges(challenges.map(challenge => {
      if (challenge.id === id) {
        const newCurrent = increment
          ? Math.min(challenge.current + 1, challenge.target)
          : Math.max(challenge.current - 1, 0)
        return { ...challenge, current: newCurrent }
      }
      return challenge
    }))
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-8 text-primary">Fitnes Wezifa Kuzatuvchisi</h1>
      
      <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
        <Input
          placeholder="Vazifalarni qidirish..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <Select onValueChange={setSelectedCategory} defaultValue="Barchasi">
          <SelectTrigger className="max-w-[180px]">
            <SelectValue placeholder="Kategoriya" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Barchasi">Barchasi</SelectItem>
            <SelectItem value="Kardio">Kardio</SelectItem>
            <SelectItem value="Kuch">Kuch</SelectItem>
            <SelectItem value="Moslashuvchanlik">Moslashuvchanlik</SelectItem>
            <SelectItem value="Balans">Balans</SelectItem>
            <SelectItem value="Aqliy salomatlik">Aqliy salomatlik</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentChallenges.map(challenge => (
          <Card key={challenge.id} className="shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xl font-bold">{challenge.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-sm text-muted-foreground mb-2">
                Maqsad: {challenge.target} {challenge.unit}
              </CardDescription>
              <Progress value={(challenge.current / challenge.target) * 100} className="w-full" />
              <p className="text-right mt-2 text-sm font-medium">
                {challenge.current} / {challenge.target} {challenge.unit}
              </p>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => updateProgress(challenge.id, false)}
                disabled={challenge.current <= 0}
              >
                Kamaytirish
              </Button>
              <Button 
                variant="default" 
                size="sm" 
                onClick={() => updateProgress(challenge.id, true)}
                disabled={challenge.current >= challenge.target}
              >
                Ko`paytirish
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="flex justify-center mt-8 space-x-2">
        <Button
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Oldingi
        </Button>
        <Button
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(filteredChallenges.length / challengesPerPage)))}
          disabled={currentPage === Math.ceil(filteredChallenges.length / challengesPerPage)}
        >
          Keyingi
        </Button>
      </div>
    </div>
  )
}