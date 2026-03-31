package main

import (
	"encoding/json"
	"net/http"

	"github.com/gin-gonic/gin"
)

type SimulationResponse struct {
	Disruption     int     `json:"disruption"`
	PredictedPrice float64 `json:"predicted_price"`
}

func main() {
	r := gin.Default()

	oilPrice := 110.0

	// mock oil price
	r.GET("/oil-price", func(c *gin.Context) {
		oilPrice += 0.5
		c.JSON(200, gin.H{
			"price": oilPrice,
		})
	})

	// call python service
	r.GET("/simulate", func(c *gin.Context) {
		resp, err := http.Get("http://localhost:8000/simulate?disruption=15")
		if err != nil {
			c.JSON(500, gin.H{"error": err.Error()})
			return
		}
		defer resp.Body.Close()

		var result SimulationResponse
		json.NewDecoder(resp.Body).Decode(&result)

		c.JSON(200, result)
	})

	r.Run(":8080")
}
