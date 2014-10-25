describe('Currency', function(){

    beforeEach(module('components.currency'));

    describe('currencyCodeToSymbol', function(){

        var currencyCodeToSymbol;

        beforeEach(inject(function($filter){
            currencyCodeToSymbol = $filter('currencyCodeToSymbol');
        }));

        it('should return correct symbols', function(){
            var symbols = {
                GBP: '£',
                EUR: '€',
                USD: '$'
            };

            for(var code in symbols){
                expect(currencyCodeToSymbol(code)).toBe(symbols[code]);
            }
        });

    });
});