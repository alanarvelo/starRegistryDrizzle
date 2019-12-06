import React from 'react'
import { ContractForm } from "@drizzle/react-components";


export default function CreateStar () {
    return (
      <div className="section">
        <h2>Create Star</h2>
        <ContractForm
          contract="StarNotary"
          method="createStar"
          labels={["Star Name (string)", "Star Id (uint)"]}
        />
      </div>
    )
}