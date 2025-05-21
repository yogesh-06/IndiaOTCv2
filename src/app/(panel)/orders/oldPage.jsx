"use client";
import CommonTable from "@/component/panel/CommonTable";
import { useUser } from "@/context/UserContext";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function Orders() {
  const router = useRouter();
  const { user } = useUser();

  return (
    <div className=" py-5">
      <div className="container-fluid">
        <div className="d-flex flex-column gap-4 p-3 ">
          <h2 className="text-white">Orders</h2>
          <span className="border border-1 border-top border-secondary w-100"></span>

          <div className="table-responsive">
            <table className="table table-bordered table-dark">
              <thead className="">
                <tr>
                  <th className="text-secondary">Date</th>
                  <th className="text-secondary">Order Number</th>
                  <th className="text-secondary">Order Number</th>
                  <th className="text-secondary">Fiat / Crypto Amount</th>
                  <th className="text-secondary">Counterparty</th>
                  <th className="text-secondary">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colspan="6">
                    <div className="d-flex align-items-center justify-content-center flex-column gap-24 py-5">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="50px"
                        width="50px"
                        version="1.1"
                        id="_x32_"
                        viewBox="0 0 512 512"
                      >
                        <style type="text/css"></style>
                        <g>
                          <path
                            fill="#6c757d"
                            className="st0"
                            d="M329.364,237.908l42.558-39.905c25.237-23.661,39.552-56.701,39.552-91.292V49.156   c0.009-13.514-5.53-25.918-14.392-34.754C388.236,5.529,375.833-0.009,362.319,0H149.682c-13.515-0.009-25.926,5.529-34.764,14.401   c-8.871,8.837-14.41,21.24-14.393,34.754v57.554c0,34.591,14.316,67.632,39.552,91.292l42.55,39.888   c2.343,2.205,3.678,5.271,3.678,8.492v19.234c0,3.221-1.335,6.279-3.669,8.476l-42.558,39.905   c-25.236,23.652-39.552,56.701-39.552,91.292v57.554c-0.017,13.515,5.522,25.918,14.393,34.755   c8.838,8.871,21.249,14.41,34.764,14.401h212.636c13.514,0.009,25.917-5.53,34.763-14.401c8.862-8.838,14.401-21.24,14.392-34.755   V405.29c0-34.591-14.316-67.64-39.552-91.292l-42.55-39.897c-2.342-2.205-3.678-5.263-3.678-8.484v-19.234   C325.694,243.162,327.03,240.096,329.364,237.908z M373.946,462.844c-0.009,3.273-1.274,6.056-3.41,8.218   c-2.162,2.136-4.945,3.402-8.217,3.41H149.682c-3.273-0.009-6.064-1.274-8.226-3.41c-2.136-2.162-3.393-4.945-3.402-8.218V405.29   c0-24.212,10.026-47.356,27.691-63.91l42.55-39.906c9.914-9.285,15.538-22.273,15.538-35.857v-19.234   c0-13.592-5.625-26.58-15.547-35.866l-42.542-39.896c-17.666-16.554-27.691-39.69-27.691-63.91V49.156   c0.009-3.273,1.266-6.055,3.402-8.226c2.162-2.127,4.953-3.394,8.226-3.402h212.636c3.272,0.008,6.055,1.274,8.217,3.402   c2.136,2.171,3.402,4.952,3.41,8.226v57.554c0,24.22-10.026,47.356-27.691,63.91l-42.55,39.896   c-9.914,9.286-15.538,22.274-15.538,35.866v19.234c0,13.584,5.625,26.572,15.547,35.874l42.542,39.88   c17.666,16.563,27.691,39.707,27.691,63.919V462.844z"
                          />
                        </g>
                      </svg>
                      <p className="text-secondary">
                        No data available. The table is empty.
                      </p>
                    </div>
                  </td>
                </tr>
              </tbody>
              <tfoot className="">
                <tr>
                  <th className="text-secondary">Date</th>
                  <th className="text-secondary">Order Number</th>
                  <th className="text-secondary">Order Number</th>
                  <th className="text-secondary">Fiat / Crypto Amount</th>
                  <th className="text-secondary">Counterparty</th>
                  <th className="text-secondary">Status</th>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
