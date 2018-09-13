// Dom7
var $$ = Dom7;

// Framework7 App main instance
var app  = new Framework7({
  root: '#app', // App root element
  id: 'br.com.calcularimc', // App bundle ID
  name: 'IMC', // App name
  theme: 'auto', // Automatic theme detection
  // App root data
  data: function () {
    return {
      user: {
        firstName: 'John',
        lastName: 'Doe',
      },
      // Demo products for Catalog section
      products: [
        {
          id: '1',
          title: 'Apple iPhone 8',
          description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nisi tempora similique reiciendis, error nesciunt vero, blanditiis pariatur dolor, minima sed sapiente rerum, dolorem corrupti hic modi praesentium unde saepe perspiciatis.'
        },
        {
          id: '2',
          title: 'Apple iPhone 8 Plus',
          description: 'Velit odit autem modi saepe ratione totam minus, aperiam, labore quia provident temporibus quasi est ut aliquid blanditiis beatae suscipit odio vel! Nostrum porro sunt sint eveniet maiores, dolorem itaque!'
        },
        {
          id: '3',
          title: 'Apple iPhone X',
          description: 'Expedita sequi perferendis quod illum pariatur aliquam, alias laboriosam! Vero blanditiis placeat, mollitia necessitatibus reprehenderit. Labore dolores amet quos, accusamus earum asperiores officiis assumenda optio architecto quia neque, quae eum.'
        },
      ]
    };
  },
  // App root methods
  methods: {
    helloWorld: function () {
      app.dialog.alert('Hello World!');
    },
  },
  // App routes
  routes: routes,
});

// Init/Create views
var homeView = app.views.create('#view-home', {
  url: '/'
});
var settingsView = app.views.create('#view-settings', {
  url: '/settings/'
});

var pesoGauge = app.gauge.create({
  el: '.peso-gauge',
  type: 'semicircle',
  value: 0,
  size: 250,
  borderColor: '#f44336',
  borderWidth: 10,
  valueText: '0KG',
  valueFontSize: 41,
  valueTextColor: '#f44336',
  labelText: 'dentro do peso normal',
});

$$('#view-home .calcular-imc-button').on('click', function () {
  var peso = $$('#view-home [name="peso"]').val();
  var altura = $$('#view-home [name="altura"]').val();
  var idade = $$('#view-home [name="idade"]').val();
  var sexo = $$('#view-home [name="sexo"]').val();
  
  if(peso == ''){
    app.dialog.alert('Informe o seu peso!');
  }else{
    if(altura == ''){
      app.dialog.alert('Informe a sua altura!');
    }else{
      if(idade == ''){
        app.dialog.alert('Informe a sua idade!');
      }else{
        peso = peso * 1;
        var taxaMetabolicaBasal = calcularTaxaMetabolicaBasal(peso, altura, idade, sexo);
        
        altura = altura/100;
        var imc = calcularIMC(peso, altura);
        var resultado = resultadoIMC(imc);
        var menorPeso = calcularMenorPesoNormal(altura);
        var maiorPeso = calcularMaiorPesoNormal(altura);
        atualizarGraficoComInformacao(peso, menorPeso, maiorPeso);

        
        
        $$('#view-home .imc').html('IMC '+ (imc.toFixed(2)));
        $$('#view-home .resultado-imc').html(resultado);
        $$('#view-home .peso-ideal').html('O seu peso ideal está entre '+menorPeso+ ' e '+maiorPeso);
        $$('#view-home .taxa-metabolica-basal').html(taxaMetabolicaBasal.toFixed(2) + 'Kcal/dia');
      }
    }
  }
  
});

function calcularIMC(peso, altura){
  var imc = (peso/(altura * altura));
  return imc;
}

function resultadoIMC(imc){
  var resultado = '';
  if(imc.toFixed(2) < 16){
    resultado = 'Magreza Grave';
  }else{
    if(imc.toFixed(2) >= 16 && imc.toFixed(2) < 17){
      resultado = 'Magreza Moderada';
    }else{ 
      if(imc.toFixed(2) >= 17 && imc.toFixed(2) < 18.50){
        resultado = 'Magreza Leve';
      }else{ 
        if(imc.toFixed(2) >= 18.50 && imc.toFixed(2) < 25){
          resultado = 'Saudável';
        }else{  
          if(imc.toFixed(2) >= 25 && imc.toFixed(2) < 30){
            resultado = 'Sobrepeso';
          }else{
            if(imc.toFixed(2) >= 30 && imc.toFixed(2) < 35){
              resultado = 'Obesidade Grau I';
            } else{
              if(imc.toFixed(2) >= 35 && imc.toFixed(2) < 40){
                resultado = 'Obesidade Grau II (Severa)';
              } else{
                if(imc.toFixed(2) >= 40){
                  resultado = 'Obesidade Grau III (Mórbida)';
                } 
              }
            }
          }
        }  
      }
    }
  }
  
  return resultado;
}

function calcularMenorPesoNormal(altura){
  return (18.50 * (altura * altura)).toFixed(2);
}

function calcularMaiorPesoNormal(altura){
  return (25 * (altura * altura)).toFixed(2);
}

function atualizarGraficoComInformacao(peso, menorPeso, maiorPeso){
  if(peso < menorPeso){
    pesoGauge.update({
      value: ((menorPeso - peso) / peso).toFixed(2),
      valueText: (menorPeso - peso).toFixed(2) + 'KG',
      labelText: 'abaixo do peso normal'
    });
  }else{
    if(peso > maiorPeso){
      pesoGauge.update({
        value: ((peso - maiorPeso) / peso).toFixed(2),
        valueText: (peso - maiorPeso).toFixed(2) + 'KG',
        labelText: 'acima do peso normal'
      });
    }else{
      pesoGauge.update({
        value: 0.00,
        valueText: '0 KG',
        labelText: 'dentro do peso normal'
      });
    }
    
  }
}

function calcularTaxaMetabolicaBasal(peso, altura, idade, sexo){
  var tmb = 0;
  if(sexo == 'masculino'){
    tmb = 88.36 + (13.4 * peso) + (4.8 * altura) - (5.7 * idade);
  }else{
    tmb = 447.6 + (9.2 * peso) + (3.1 * altura) - (4.3 * idade);
  }
  return tmb;
}
