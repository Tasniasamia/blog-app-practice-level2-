type IOptions={
    page?:string | number,
    limit?:string | number,
    sortOrder?:string | undefined,
    sortBy?:string | undefined
}
type IOptionsResult={
    page:number,
    limit:number,
    skip:number,
    sortBy:string,
    sortOrder:string
}
const paginationSortingHelper=(options:IOptions):IOptionsResult=>{
const page:number=Number(options?.page) || 1;
const limit:number=Number(options?.limit) || 8;
const skip:number=Number((page-1)*limit);
const sortBy:string=options?.sortBy || 'createdAt';
const sortOrder:string=options?.sortOrder || 'desc';
return {
    page,limit,skip,sortBy,sortOrder
}



}
export default paginationSortingHelper;