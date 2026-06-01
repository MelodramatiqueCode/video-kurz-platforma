"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function ContinueLearningCard({
  daySlug,
  dayTitle,
  lessonTitle,
}: {
  daySlug: string;
  dayTitle: string;
  lessonTitle: string;
}) {
  return (
    <Card className="border-primary/15 bg-accent/40">
      <CardHeader>
        <CardTitle>Pokračovať v učení</CardTitle>
        <CardDescription>
          {dayTitle} · {lessonTitle}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button asChild>
          <Link href={`/program/den/${daySlug}`}>
            Pokračovať
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
