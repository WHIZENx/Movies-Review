import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'numberSuff'
})
export class NumberSuffixesPipe implements PipeTransform {

  transform(input: any, args?: any): any {
    var value, exp, rounded, suffixes = ['k', 'M', 'G', 'T', 'P', 'E'];

    if (Number.isNaN(input)) return null;

    if (input < 1000) return input;

    exp = Math.floor(Math.log(input) / Math.log(1000));
    value = input / Math.pow(1000, exp);
    return (value).toFixed(args+1).slice(0, (args*-1)) + suffixes[exp - 1];
  }

}