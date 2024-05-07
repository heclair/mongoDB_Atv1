// Exercício 01

db.estacoes.find(
  {},
  {
    uf: 1, 
    estacao: 1,
    latitude: 1,
    longitude: 1,
    _id: 0
  },
  {
    sort: {
      uf: 1
    }
  }
);


//Exercício 02

db.estacoes.aggregate([
  {
    $project: {
      estacao: 1,
      quantidade: { $size: "$leituras" },
      _id: 0
    }
  },
  {
    $sort: { estacao: 1 }
  }
]);


// EXERCICIO 03

db.estacoes.aggregate([
  {
    $match: { estacao: "VITORIA" }
  },
  {
    $unwind: "$leituras" 
  },
  {
    $group: {
      _id: "$estacao",
      media: { $avg: "$leituras.temperaturaAr" }, 
      minimo: { $min: "$leituras.temperaturaAr" }, 
      maximo: { $max: "$leituras.temperaturaAr" } 
    }
  },
  {
    $project: {
      _id: 0, 
      estacao: "$_id",
      media: "$media",
      minimo: "$minimo",
      maximo: "$maximo"
    }
  }
])


// EXERCICIO 04

db.estacoes.aggregate([
  {
    $unwind: "$leituras"
  },
  {
    $match: {
      "leituras.datahora": {
        $gte: ISODate("2024-01-02T00:00:00.000Z"),
        $lte: ISODate("2024-01-03T23:00:00.000Z")
      }
    }
  },
  {
    $group: {
      _id: "$estacao",
      leituras: {
        $push: {
          leitura: "$leituras.temperaturaAr",
          data: "$leituras.datahora"
        }
      }
    }
  },
  {
    $project: {
      _id: 0,
      estacao: "$_id",
      leituras: 1 
    }
  }
]);


// EXERCICIO 05

db.estacoes.aggregate([
  {
      $match: {
          estacao: "VITORIA"
      }
  },
  {
      $unwind: "$leituras"
  },
  {
      $project: {
          dia: { $dateToString: { format: "%Y-%m-%d", date: "$leituras.datahora" } },
          temperaturaAr: "$leituras.temperaturaAr"
      }
  },
  {
      $group: {
          _id: "$dia",
          media: { $avg: "$temperaturaAr" },
          minima: { $min: "$temperaturaAr" },
          maxima: { $max: "$temperaturaAr" },
          leituras: { $push: "$temperaturaAr" }
      }
  },
  {
      $project: {
          _id: 0,
          media: 1,
          minima: 1,
          maxima: 1,
    quantidade: { $size: "$leituras" },
          data: "$_id"
      }
  },
  {
      $sort: {
          data: 1
      }
  },
  {
      $limit: 4
  }
])