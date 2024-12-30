import './types.ts';
import * as d3 from 'd3';

type Dataset = {
  name: string;
  label: string;
  data: (stat: Stat) => number;
  enabled: boolean;
};

type GraphObject = {
  type: string;
  options: {
    plugins: {
      tooltip: {
        callbacks: {
          label: (context: { dataset: Dataset; raw: number }) => string;
        };
      };
    };
    elements: {
      line: {
        tension: number;
        borderWidth: number;
      };
      point: {
        radius: number;
        hoverRadius: number;
        hitRadius: number;
      };
    };
    scales: {
      r: {
        suggestedMin: number;
        suggestedMax: number;
        ticks: {
          showLabelBackdrop: boolean;
          maxTicksLimit: number;
          stepSize: number;
          precision: number;
          z: number;
        };
      };
    };
  };
  data: { datasets: Dataset[] };
};

const format = (value: number) => {
  if (value > 99.99999999) return value.toPrecision(12);
  else if (value > 99.999999) return value.toPrecision(10);
  else if (value > 99.9999) return value.toPrecision(8);
  else if (value > 99.99) return value.toPrecision(6);
  else if (value === 0) return 0;
  return value.toPrecision(4);
};

export class StatGraph {
  radius = 150;
  initalized = false;

  statScale!: d3.ScaleBand<StatName>;
  graphObject!: GraphObject;
  svg!: d3.Selection<SVGSVGElement, StatRecord, null, unknown>;
  statsContainer!: d3.Selection<HTMLElement, StatRecord, null, unknown>;

  getAxisTip(stat: StatName): [x: number, y: number] {
    return d3.pointRadial(this.statScale(stat)!, this.radius + 10);
  }

  init(container: HTMLElement): void {
    if (this.initalized) return;

    const orderedStats = statList.map((s) => stats[s]);
    const datasets: Dataset[] = [{
      name: 'mana_cost_reduction',
      label: _txt('stats>tooltip>mana_cost_reduction'),
      data: ({ manaMultiplier }) => (1 - manaMultiplier) * 100,
      enabled: true,
    }];

    this.statsContainer = d3.select(container).datum(stats);
    this.svg = d3.select('svg#statChart').datum(stats) as unknown as d3.Selection<
      SVGSVGElement,
      StatRecord,
      null,
      unknown
    >;
    this.svg.append('g').classed(`layer axes`, true);
    this.svg.append('g').classed(`layer legend`, true);
    this.svg.append('g').classed(`layer scaleLines`, true);
    this.svg.append('g').classed(`layer data`, true);

    const tScale = d3.scaleBand<StatName>(statList, [0, Math.PI * 2]);
    this.statScale = tScale;

    this.svg.selectChild('g.layer.axes')
      .selectAll('g.axis')
      .data(orderedStats, (s) => s.name)
      .join((enter) =>
        enter
          .append('g')
          .classed('axis', true)
          .call((enter) => enter.append('path'))
          .call((enter) =>
            enter
              .append('g')
              .classed('label', true)
              .append('text')
          )
      )
      .call((axis) =>
        axis
          .selectChild('path')
          .attr('d', (stat) =>
            d3.lineRadial()([[this.statScale(stat.name)!, 0], [this.statScale(stat.name)!, this.radius]]))
      )
      .call((axis) =>
        axis
          .selectChild('g.label')
          .attr(
            'transform',
            (stat) => `translate(${d3.pointRadial(this.statScale(stat.name)!, this.radius + 10).join()})`,
          )
          .selectChild('text')
          .text((stat) => stat.short_form)
      );

    this.svg.selectChild('g.legend')
      .attr('transform', `translate(0, ${-this.radius - 20})`)
      .selectChildren('g.dataset')
      .data(datasets)
      .join((enter) =>
        enter
          .append('g')
          .classed('dataset', true)
          .call((enter) => enter.append('text'))
          .call((enter) => enter.append('rect'))
      )
      .attr('data-dataset', (d) => d.name)
      .call((set) =>
        set
          .selectChild('text')
          .attr('y', -10)
          .text((d) => d.label)
      )
      .call((set) =>
        set
          .selectChild('rect')
          .attr('x', -30)
          .attr('y', -15)
          .attr('width', 25)
          .attr('height', 10)
      )
      .attr('transform', function () {
        const { width, x } = (this as SVGGElement).getBBox();

        return `translate(-${(width + x * 2) / 2}, 0)`;
      });

    this.graphObject = {
      type: 'radar',
      options: {
        plugins: {
          tooltip: {
            callbacks: {
              label: ({ raw, dataset }) => `${dataset.label}: ${format(raw)}%`,
            },
          },
        },
        elements: {
          line: {
            tension: 0,
            borderWidth: 4,
          },
          point: {
            radius: 5,
            hoverRadius: 6,
            hitRadius: 1,
          },
        },
        scales: {
          r: {
            suggestedMin: 0,
            suggestedMax: 20,
            ticks: {
              showLabelBackdrop: false,
              maxTicksLimit: 6,
              stepSize: 10,
              precision: 0,
              z: 1,
            },
          },
        },
      },
      data: { datasets },
    };

    this.initalized = true;
    this.update();
  }

  autoscaleRange(dataset: Dataset): [min: number, max: number] {
    const dataMax = d3.max(Object.values(stats).map(dataset.data))!;
    const scaleMax = Math.max(Math.ceil(dataMax / 10) * 12.5, 22.5);
    const ticks = d3.ticks(0.01, scaleMax, 3);

    return [0, Math.max(scaleMax, ticks[ticks.length - 1] * 1.25)];
  }

  update(skipAnimation: boolean = false): void {
    if (!this.initalized) return;

    const tScale = this.statScale;
    const { data: { datasets } } = this.graphObject;

    const autoscale = this.autoscaleRange(datasets[0]);

    const rScale = d3.scaleLinear()
      .domain(autoscale)
      .range([0, this.radius]);

    const pointScale = ([name, value]: [StatName, number]) => d3.pointRadial(tScale(name)!, rScale(value)!);

    const line = d3.lineRadial().angle(tScale);
    const ticks = d3.ticks(1, autoscale[1], 3);

    const closedStatNames = [...statList, statList[0]];
    const closedStats = closedStatNames.map((name) => stats[name]);
    const transition = d3.transition()
      .duration(skipAnimation ? 0 : 250)
      .ease(d3.easeSinIn);

    this.svg.selectChild('g.layer.scaleLines')
      .selectAll('g.scaleLine')
      .data(ticks, (t) => t as number)
      .join((enter) =>
        enter
          .append('g')
          .classed('scaleLine', true)
          .call((enter) => enter.append('path'))
          .call((enter) => enter.append('text'))
      )
      .transition(transition)
      .call((lines) =>
        lines
          .selectChild('path')
          .attr('d', (d) => line.radius(() => rScale(d))(closedStatNames))
      )
      .call((lines) =>
        lines
          .selectChild('text')
          .attr('x', 0)
          .attr('y', (d) => -rScale(d) - 2)
          .text((d) => d.toString())
      );

    this.svg.selectChild('g.layer.data')
      .selectAll('g.dataset')
      .data(datasets, (d) => d.label)
      .join((enter) =>
        enter
          .append('g')
          .classed('dataset', true)
          .call((enter) => enter.append('polygon'))
      )
      .attr('data-dataset', (set) => set.name)
      .call((sets) =>
        sets
          .selectChild('polygon')
          .transition(transition)
          .attr('points', (set) => closedStats.map((stat) => pointScale([stat.name, set.data(stat)]).join()).join(' '))
      )
      .call((datasets) =>
        datasets
          .selectChildren('g.datapoint')
          .data(
            (dataset) => Object.values(stats).map((stat) => [dataset, stat]),
            ([, stat]: any) => stat.name,
          )
          .join((enter) =>
            enter
              .append('g')
              .classed('datapoint', true)
              .call((enter) => enter.append('circle'))
          )
          .transition(transition)
          .attr(
            'transform',
            ([dataset, stat]: any) => `translate(${pointScale([stat.name, dataset.data(stat)]).join()})`,
          )
          .selectChild('circle')
          .attr('r', this.graphObject.options.elements.point.radius)
      );

    view.updateStatGraphNeeded = false;
  }
}

globalThis.trash.StatGraph = StatGraph;
