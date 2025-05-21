"use client";
import { DateFormate } from "@/component/global";
import CommonTable from "@/component/panel/CommonTable";
import { useUser } from "@/context/UserContext";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function Orders() {
  const router = useRouter();
  const { user } = useUser();

  const [purchases, setPurchases] = useState([]);
  const apiUrl = `accounts/party/getTransByUserParty/${user?.party?._id}`;
  const [series, setSeries] = useState({
    currentPageNumber: 1,
    currentPageSize: 0,
  });
  const headers = [
    { key: "type", label: "Type" },
    { key: "quantity", label: "Transaction" },
    { key: "createdAt", label: "Date" },
    { key: "createdBy.username", label: "Admin" },
    { key: "description", label: "Description" },
  ];

  return (
    <div className="container-fluid">
      <div className="">
        <h2 className="">Orders</h2>
      </div>
      <div className="d-flex flex-column gap-4 py-3 ">
        <CommonTable
          apiUrl={apiUrl}
          headers={headers}
          setData={setPurchases}
          setSeries={setSeries}
        >
          {purchases?.data?.length > 0 ? (
            purchases?.data.map((purchase, index) => {
              const serialNumber =
                (series.currentPageNumber - 1) * series.currentPageSize +
                index +
                1;
              return (
                <tr key={index}>
                  <td className=" text-capitalize">{serialNumber}</td>

                  <td className=" text-capitalize">{purchase.type}</td>
                  <td
                    className=" text-capitalize"
                    dangerouslySetInnerHTML={{
                      __html: purchase.transaction,
                    }}
                  />
                  <td className=" text-capitalize">
                    {DateFormate(purchase.createdAt)}
                  </td>
                  <td className=" text-capitalize">{purchase.createdBy}</td>
                  <td className=" text-capitalize">{purchase.description}</td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan="9" className="text-center">
                No Data Found
              </td>
            </tr>
          )}
        </CommonTable>
      </div>
    </div>
  );
}
