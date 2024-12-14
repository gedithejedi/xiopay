// import { NextRequest, NextResponse } from "next/server";
// import dbConnect from "@/lib/mongo";
// import logger from "@/utils/logger";
// import { Chain } from "@/lib/chain";
// import { parseURLSearchParams } from "@/lib/parser";
// import explorerService from "../explorer-service";

// export interface TransactionFilter {
//   startDate?: string | undefined;
//   endDate?: string | undefined;
// }

// interface GetTransactionsRequest {
//   address: string;
//   "chains[]": Chain[];
// }

// export async function GET(request: NextRequest) {
//   const params = parseURLSearchParams(request.nextUrl.searchParams);
//   const { address, "chains[]": chains }: GetTransactionsRequest = params as any;

//   if (!chains || chains.length === 0) {
//     return NextResponse.json({ error: "No chains provided" }, { status: 400 });
//   }

//   if (!address) {
//     return NextResponse.json(
//       { error: "User address is required" },
//       { status: 400 }
//     );
//   }

//   try {
//     await dbConnect();
//     logger.info("Indexing transactions for address:", address);

//     const transactions = await explorerService.indexTransactions({
//       address,
//       networks: chains?.map((c: any) => Number(c)) as Chain[],
//     });

//     return NextResponse.json({ data: transactions }, { status: 200 });
//   } catch (error) {
//     logger.error("Error indexing transactions:", error);
//     return NextResponse.json(
//       { error: "Internal Server Error" },
//       { status: 500 }
//     );
//   }
// }
