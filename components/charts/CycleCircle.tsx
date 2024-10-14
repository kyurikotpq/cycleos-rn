import React, { PureComponent } from "react";

const data = [
  { name: "Menstrual", value: 4 },
  { name: "Follicular", value: 29 - 4 - 5 - 14 },
  { name: "Ovulatory", value: 5 },
  { name: "Luteal", value: 14 },
];
const COLORS = ["#FF6459", "#F1B8D1", "#8AEAF0", "#FFCA6A"];

export function CycleCircle() {
  return (
    <PieChart width={800} height={400}>
      <Pie
        data={data}
        cx={120}
        cy={200}
        innerRadius={60}
        outerRadius={80}
        startAngle={90}
        endAngle={-270}
        paddingAngle={5}
        dataKey="value"
      >
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
    </PieChart>
  );
}
