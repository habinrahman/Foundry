"use client";

import { memo } from "react";
import { useTheme } from "next-themes";
import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import type { RadarAxis } from "@/types/dashboard";
import { useLocale } from "@/lib/i18n/hooks";
import { EmptyState } from "@/components/ui/empty-state";
import { Panel, PanelHeader } from "./panel";

export const CandidateRadarChart = memo(function CandidateRadarChart({
  data,
  delay = 0.1,
}: {
  data: RadarAxis[];
  delay?: number;
}) {
  const { resolvedTheme } = useTheme();
  const { t, formatNumber } = useLocale();
  const panel = t.recruiter.panels.radar;

  return (
    <Panel delay={delay} className="h-full">
      <PanelHeader title={panel.title} subtitle={panel.subtitle} />
      {data.length === 0 ? (
        <EmptyState title={panel.empty.title} description={panel.empty.description} />
      ) : (
        <div className="h-[280px] w-full" key={resolvedTheme}>
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={data} cx="50%" cy="50%" outerRadius="70%">
              <PolarGrid stroke="var(--chart-grid)" />
              <PolarAngleAxis
                dataKey="axis"
                tick={{
                  fill: "var(--muted)",
                  fontSize: 11,
                  fontFamily: "var(--font-body)",
                }}
              />
              <PolarRadiusAxis
                angle={30}
                domain={[0, 100]}
                tickFormatter={(value: number) => formatNumber(value)}
                tick={{
                  fill: "var(--muted)",
                  fontSize: 10,
                  fontFamily: "var(--font-geist-mono)",
                }}
                axisLine={false}
              />
              <Tooltip
                formatter={(value) => [
                  formatNumber(typeof value === "number" ? value : Number(value)),
                  panel.scoreLabel,
                ]}
                contentStyle={{
                  background: "var(--surface-elevated)",
                  border: "1px solid var(--border)",
                  borderRadius: 12,
                  fontSize: 12,
                  fontFamily: "var(--font-body)",
                }}
                labelStyle={{ color: "var(--foreground)" }}
              />
              <Radar
                name={panel.scoreLabel}
                dataKey="score"
                stroke="var(--chart-1)"
                fill="var(--chart-1)"
                fillOpacity={0.26}
                strokeWidth={2}
                isAnimationActive
                animationDuration={900}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      )}
    </Panel>
  );
});
